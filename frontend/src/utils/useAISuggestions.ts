import { useCallback, useState } from "react";
import type {
  CustomerSuggestion,
  InvoiceContext,
  ServiceSuggestion,
} from "@invoice/shared/types";
import type { ChatMessageData } from "../components/layout/AIChatMessage";
import {
  useInvoiceAIPreview,
  useQuotationAIPreview,
} from "../features/hooks/useInvoiceAI";
import type { ConversationTurn } from "../features/api/invoiceAI.api";

type ChatErrorData = NonNullable<ChatMessageData["error"]>;
export type DocumentType = "INVOICE" | "QUOTATION";

const QUOTATION_KEYWORDS = [
  "quote",
  "quotation",
  "estimate",
  "proposal",
  "qtn",
  "qte",
];

export function detectDocumentType(text: string): DocumentType {
  const lower = text.toLowerCase();
  return QUOTATION_KEYWORDS.some((kw) => lower.includes(kw))
    ? "QUOTATION"
    : "INVOICE";
}

function buildErrorData(error: any): ChatErrorData {
  const details = error?.response?.data?.details;
  const message = error?.response?.data?.message || "Something went wrong";

  if (details?.suggestedCustomers) {
    return {
      message: "Customer not found. Did you mean one of these?",
      type: "CUSTOMER_NOT_FOUND",
      customerName: message.match(/"([^"]+)"/)?.[1] || "Unknown",
      suggestions: details.suggestedCustomers,
    };
  }

  if (details?.suggestedServices && details.suggestedServices.length > 0) {
    return {
      message: `Service "${details.suggestedServices[0].requested}" not found. Did you mean one of these?`,
      type: "SERVICE_NOT_FOUND",
      serviceNames: details.suggestedServices.map((s: any) => s.requested),
      suggestions: details.suggestedServices,
    };
  }

  if (details?.suggestions) {
    return {
      message: "Multiple services found. Please select one:",
      type: "SERVICE_NOT_FOUND",
      serviceNames: details.suggestions.map((s: any) => s.requested),
      suggestions: details.suggestions,
    };
  }

  if (details?.unmatchedServices) {
    return {
      message,
      type: "SERVICE_NOT_FOUND",
      serviceNames: details.unmatchedServices.map((s: any) => s.requested),
      suggestions: details.suggestions,
    };
  }

  return { message, type: "INVALID_INPUT" };
}

export function useInvoiceAIChat() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [context, setContext] = useState<InvoiceContext>({});
  const [lastUserText, setLastUserText] = useState("");

  const invoicePreview = useInvoiceAIPreview();
  const quotationPreview = useQuotationAIPreview();

  const addThinkingMessage = useCallback(() => {
    const id = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id, type: "ai", text: "", isThinking: true },
    ]);
    return id;
  }, []);

  const resolveThinkingMessage = useCallback(
    (id: string, patch: Partial<ChatMessageData>) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, isThinking: false, ...patch } : m,
        ),
      );
    },
    [],
  );

  const updateContextFromPreview = useCallback((previewData: any) => {
    if (!previewData?.invoice) return;
    setContext({
      customerName: previewData.invoice.customer.name,
      customerId: previewData.invoice.customer.id,
      services: previewData.invoice.items.map((item: any) => ({
        name: item.description,
        quantity: item.quantity,
        discount: item.discount,
        discountType: "percentage" as const,
      })),
      discount: previewData.invoice.discount || 0,
    });
  }, []);

  // Build history from messages
  const buildHistory = useCallback(
    (currentMessages: ChatMessageData[]): ConversationTurn[] => {
      return currentMessages
        .filter((m) => !m.isThinking)
        .map((m) => ({
          role: m.type === "user" ? ("user" as const) : ("assistant" as const),
          content:
            m.text ||
            (m.preview ? "Preview shown" : m.error?.message || ""),
        }));
    },
    [],
  );

  const runPreview = useCallback(
    async (
      requestText: string,
      nextContext: InvoiceContext,
      displayText?: string,
      forcedDocType?: DocumentType,
    ) => {
      const documentType: DocumentType =
        forcedDocType ?? detectDocumentType(requestText);

      const userMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        type: "user",
        text: displayText ?? requestText,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setLastUserText(requestText);

      const thinkingId = addThinkingMessage();

      const history = buildHistory(messages);

      // Pick the right mutation based on detected document type
      const previewMutation =
        documentType === "QUOTATION" ? quotationPreview : invoicePreview;

      try {
        const result = await previewMutation.mutateAsync({
          text: requestText,
          context:
            Object.keys(nextContext).length > 0 ? nextContext : undefined,
          history,
        });

        updateContextFromPreview(result.data);

        resolveThinkingMessage(thinkingId, {
          preview: result.data,
          sourceText: requestText,
          documentType,
        });
      } catch (error) {
        resolveThinkingMessage(thinkingId, {
          error: buildErrorData(error),
          documentType,
        });
      }
    },
    [
      messages,
      invoicePreview,
      quotationPreview,
      addThinkingMessage,
      resolveThinkingMessage,
      updateContextFromPreview,
      buildHistory,
    ],
  );

  const sendText = useCallback(
    (text: string) => {
      const forMatch = text.match(/\bfor\s+([^,]+)/i);
      const newCustomerName = forMatch?.[1]?.trim();
      const documentType = detectDocumentType(text);

      if (
        newCustomerName &&
        context.customerName &&
        newCustomerName.toLowerCase() !== context.customerName.toLowerCase()
      ) {
        setContext({});
        runPreview(text, {}, undefined, documentType);
      } else {
        runPreview(text, context, undefined, documentType);
      }
    },
    [runPreview, context],
  );

  const selectCustomer = useCallback(
    (customer: CustomerSuggestion) => {
      const updatedContext: InvoiceContext = {
        ...context,
        customerName: customer.name,
        customerId: customer.id,
      };
      setContext(updatedContext);

      // Preserve document type across selection
      const documentType = detectDocumentType(lastUserText);

      let fullText = lastUserText;

      if (context.customerName) {
        fullText = fullText.replace(context.customerName, customer.name);
      } else {
        const forMatch = fullText.match(/for\s+([^,]+)/i);
        if (forMatch) {
          fullText = fullText.replace(forMatch[1], customer.name);
        }
      }

      if (!fullText) {
        fullText =
          documentType === "QUOTATION"
            ? `make quote for ${customer.name}`
            : `make invoice for ${customer.name}`;
        if (updatedContext.services?.length) {
          fullText += `, ${updatedContext.services
            .map((s) => s.name)
            .join(", ")}`;
        }
        if (updatedContext.discount) {
          fullText += `, ${updatedContext.discount}% discount`;
        }
      }

      return runPreview(
        fullText,
        updatedContext,
        `Selected customer: ${customer.name}`,
        documentType,
      );
    },
    [context, lastUserText, runPreview],
  );

  const selectService = useCallback(
    (service: ServiceSuggestion) => {
      const existing = context.services || [];
      const alreadyPresent = existing.some(
        (s) => s.name.toLowerCase() === service.name.toLowerCase(),
      );
      const services = alreadyPresent
        ? existing
        : [
            ...existing,
            {
              name: service.name,
              id: service.id,
              quantity: 1,
              discount: context.discount || 0,
              discountType: "percentage" as const,
            },
          ];

      const updatedContext: InvoiceContext = { ...context, services };
      setContext(updatedContext);

      const documentType = detectDocumentType(lastUserText);

      let fullText =
        documentType === "QUOTATION" ? "make quote" : "make invoice";

      if (updatedContext.customerName) {
        fullText += ` for ${updatedContext.customerName}`;
      }

      fullText += `, ${services.map((s) => s.name).join(", ")}`;

      if (updatedContext.discount) {
        fullText += `, ${updatedContext.discount}% discount`;
      }

      return runPreview(
        fullText,
        updatedContext,
        `Selected service: ${service.name}`,
        documentType,
      );
    },
    [context, lastUserText, runPreview],
  );

  return {
    messages,
    context,
    setContext,
    sendText,
    selectCustomer,
    selectService,
    isSelecting: invoicePreview.isPending || quotationPreview.isPending,
  };
}