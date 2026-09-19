import type {
  ParsedInvoiceData,
  ParsedInvoiceItem,
  DocumentType,
} from "./invoiceAI.types";
import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/constants/httpStatus";

const MAX_INPUT_LENGTH = 2000;
const REQUEST_TIMEOUT_MS = 10000;
const MAX_GROQ_RETRIES = 2;

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export class InvoiceAIParser {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";

    if (!this.apiKey) {
      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Groq API key is not configured",
      });
    }

    this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    this.model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  }

  async parseInvoiceText(
    text: string,
    history: ConversationTurn[] = [],
    documentType: DocumentType = "INVOICE",
  ): Promise<ParsedInvoiceData> {
    const trimmed = text.trim();

    if (!trimmed) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: "Please provide invoice text",
      });
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Message is too long (max ${MAX_INPUT_LENGTH} characters). Please shorten it.`,
      });
    }

    const prompt = this.buildPrompt(trimmed, history, documentType);

    try {
      const raw = await this.callGroq(prompt, history);
      const parsed = await this.parseJSONWithRetry(raw, prompt, history);

      if ((parsed as any).error) {
        throw new AppError({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message:
            (parsed as any).message ||
            "I couldn't understand that as an invoice request.",
        });
      }

      this.enrichContactInfo(parsed, trimmed);

      return parsed;
    } catch (error) {
      if (error instanceof AppError) throw error;

      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as any).message)
          : "Something went wrong while processing your request.";

      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message,
      });
    }
  }

  private async callGroq(
    prompt: string,
    history: ConversationTurn[] = [],
    attempt = 0,
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are a JSON extraction API for an invoicing assistant. Return ONLY valid JSON. No explanations, no markdown, no code blocks.",
            },
            ...history.map((turn) => ({
              role: turn.role,
              content: turn.content,
            })),
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const isTransient = response.status === 429 || response.status >= 500;

        if (isTransient && attempt < MAX_GROQ_RETRIES) {
          const backoffMs = 300 * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.callGroq(prompt, history, attempt + 1);
        }

        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message:
            errorData?.error?.message ||
            "The AI service is temporarily unavailable.",
        });
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: "AI returned an empty response",
        });
      }

      return content;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if ((err as any)?.name === "AbortError") {
        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: "The AI service took too long to respond. Please try again.",
        });
      }
      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Could not reach the AI service.",
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildPrompt(
    text: string,
    history: ConversationTurn[] = [],
    documentType: DocumentType = "INVOICE",
  ): string {
    const noun = documentType === "QUOTATION" ? "quotation" : "invoice";
    const nounUpper = noun.toUpperCase();

    const historyText =
      history.length > 0
        ? history.map((t) => `${t.role}: ${t.content}`).join("\n")
        : "No previous conversation";

    return `Previous conversation:
${historyText}

Latest user message: "${text}"

Your job: Determine if this is a NEW ${noun} or MODIFICATION of existing one.

NEW ${nounUpper} if:
- Latest message mentions a customer name DIFFERENT from what was established before
- Latest message clearly starts fresh

MODIFICATION if:
- Latest message refers to existing ${noun} (add discount, change quantity, etc.)
- Latest message has SAME customer as before
- Latest message is partial (like "50%", "10k off")

If MODIFICATION:
- Keep existing customer and items
- Only update what user mentioned
- Return FULL item list

If NEW ${nounUpper}:
- Ignore previous conversation entirely
- Start fresh with new customer and items

Return ONLY JSON:
{
  "error": false,
  "customerName": "",
  "customerEmail": "",
  "customerPhone": "",
  "items": [{ "serviceName": "", "quantity": 1, "unitPrice": 0, "discount": 0, "discountType": "percentage", "taxRate": 0 }],
  "dueDate": "",
  "notes": "",
  "termsConditions": ""
}

If NOT ${noun} related:
{
  "error": true,
  "errorType": "greeting|vague|gibberish|question|unrelated",
  "message": "Friendly message"
}`;
  }

  private async parseJSONWithRetry(
    raw: string,
    originalPrompt: string,
    history: ConversationTurn[] = [],
  ): Promise<ParsedInvoiceData> {
    try {
      return this.parseJSON(raw);
    } catch {
      try {
        const repairPrompt = `Your previous response was not valid JSON. Here is what you returned:\n${raw}\n\nReturn ONLY the corrected, valid JSON object, nothing else:\n${originalPrompt}`;
        const repaired = await this.callGroq(repairPrompt, history);
        return this.parseJSON(repaired);
      } catch {
        throw new AppError({
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: "AI response could not be parsed as valid invoice data",
        });
      }
    }
  }

  private cleanResponse(text: string): string {
    return text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
  }

  private extractJSONBlock(text: string): string | null {
    const start = text.indexOf("{");
    if (start === -1) return null;

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
      const char = text[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === "{") depth++;
      if (char === "}") depth--;

      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
    return null;
  }

  private parseJSON(textResponse: string): ParsedInvoiceData {
    const cleaned = this.cleanResponse(textResponse);

    try {
      return JSON.parse(cleaned);
    } catch {
      const block = this.extractJSONBlock(cleaned);

      if (block) {
        try {
          return JSON.parse(block);
        } catch {
          // fall through
        }
      }

      throw new AppError({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "AI response does not contain valid JSON",
      });
    }
  }

  private enrichContactInfo(parsed: ParsedInvoiceData, rawText: string): void {
    if (!parsed.customerEmail) {
      const emailMatch = rawText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (emailMatch) parsed.customerEmail = emailMatch[0];
    }

    if (!parsed.customerPhone) {
      const phoneMatch = rawText.match(/(\+?\d[\d\s-]{8,}\d)/);
      if (phoneMatch) parsed.customerPhone = phoneMatch[0].trim();
    }
  }

  validateParsedData(data: ParsedInvoiceData): void {
    if (!data || typeof data !== "object") {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message:
          'Could not extract invoice data. Try: "Make invoice for [customer], [service name]"',
      });
    }

    if (!data.customerName || data.customerName.trim().length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message:
          'Could not extract customer name. Try: "Make invoice for [customer], [service]"',
      });
    }

    if (!Array.isArray(data.items)) {
      data.items = [];
    }

    data.items.forEach((item: ParsedInvoiceItem, index: number) => {
      const position = index + 1;

      if (!item.serviceName || item.serviceName.trim().length === 0) {
        throw new AppError({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message: `Item ${position}: service name is missing`,
        });
      }

      const quantity = Number(item.quantity);
      item.quantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

      const unitPrice = Number(item.unitPrice);
      item.unitPrice =
        Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0;

      const discount = Number(item.discount);
      item.discount = Number.isFinite(discount) && discount > 0 ? discount : 0;

      const taxRate = Number(item.taxRate);
      item.taxRate = Number.isFinite(taxRate) && taxRate >= 0 ? taxRate : 0;

      if (item.discountType !== "percentage" && item.discountType !== "fixed") {
        item.discountType = "percentage";
      }
    });
  }
}

export const invoiceAIParser = new InvoiceAIParser();