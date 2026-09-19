import { prisma } from "../../database/client";
import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/constants/httpStatus";
import { invoiceAIParser, ConversationTurn } from "./invoiceAI.parser";
import { DiscountUtil } from "../../common/utils/discount.util";
import { FinancialCalculations } from "../../common/calculations/financial-calculations";
import type {
  ParsedInvoiceData,
  ParsedInvoiceItem,
  CustomerMatchResult,
  MatchedService,
  GenerateInvoiceAIResponse,
  InvoiceContext,
  DocumentType,
} from "./invoiceAI.types";
import { invoiceService } from "../invoice/invoice.service";
import { quotationService } from "../quotation/quotation.service";
import { invoiceAISuggestions } from "./invoiceAI.suggestions";

export class InvoiceAIService {
  // ─────────────────────────────────────────────────────────────
  // PUBLIC — INVOICE
  // ─────────────────────────────────────────────────────────────

  async generateInvoiceFromText(
    text: string,
    userId?: string,
    context?: InvoiceContext,
    history: ConversationTurn[] = [],
  ): Promise<GenerateInvoiceAIResponse> {
    const prepared = await this.prepareInvoiceData(
      text,
      context,
      history,
      "INVOICE",
    );

    const { invoiceItems, warnings } = this.buildInvoiceItemsWithWarnings(
      prepared.mergedData,
      prepared.matchedServices,
    );

    const invoice = await invoiceService.createInvoice(
      {
        customerId: prepared.customerResult.customer.id,
        issueDate: new Date().toISOString(),
        dueDate: prepared.mergedData.dueDate,
        notes: prepared.mergedData.notes,
        termsConditions: prepared.mergedData.termsConditions,
        items: invoiceItems,
      },
      userId,
    );

    return {
      invoice: this.shapeDocumentResponse(invoice, "INVOICE"),
      warnings: [...prepared.customerResult.warnings, ...warnings],
    };
  }

  async previewInvoice(
    text: string,
    userId?: string,
    context?: InvoiceContext,
    history: ConversationTurn[] = [],
  ): Promise<GenerateInvoiceAIResponse> {
    const prepared = await this.prepareInvoiceData(
      text,
      context,
      history,
      "INVOICE",
    );

    const { invoiceItems, warnings } = this.buildInvoiceItemsWithWarnings(
      prepared.mergedData,
      prepared.matchedServices,
    );

    const totals = FinancialCalculations.calculateTotals(invoiceItems);

    const itemTotals = invoiceItems.map(
      (item) =>
        Math.round(FinancialCalculations.calculateItemTotal(item) * 100) / 100,
    );

    return {
      invoice: {
        id: "",
        invoiceNumber: "INV-PREVIEW",
        status: "DRAFT",
        subtotal: Math.round(totals.subtotal * 100) / 100,
        discount: Math.round(totals.discount * 100) / 100,
        tax: Math.round(totals.tax * 100) / 100,
        total: Math.round(totals.total * 100) / 100,
        customer: {
          id: prepared.customerResult.customer.id,
          name: prepared.customerResult.customer.name,
          email: prepared.customerResult.customer.email,
        },
        items: invoiceItems.map((item, i) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Math.round(Number(item.unitPrice) * 100) / 100,
          discount: Math.round(Number(item.discount) * 100) / 100,
          taxRate: Number(item.taxRate),
          total: itemTotals[i],
        })),
      },
      warnings: [...prepared.customerResult.warnings, ...warnings],
    };
  }

  async parseTextOnly(
    text: string,
    userId?: string,
    context?: InvoiceContext,
    history: ConversationTurn[] = [],
  ): Promise<ParsedInvoiceData> {
    const contextTurns = this.contextToHistoryTurns(context);
    const parsedData = await invoiceAIParser.parseInvoiceText(
      text,
      [...contextTurns, ...history],
      "INVOICE",
    );
    const mergedData = context
      ? this.mergeWithContext(parsedData, context)
      : parsedData;

    invoiceAIParser.validateParsedData(mergedData);
    return mergedData;
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC — QUOTATION
  // ─────────────────────────────────────────────────────────────

  async generateQuotationFromText(
    text: string,
    userId?: string,
    context?: InvoiceContext,
    history: ConversationTurn[] = [],
  ): Promise<GenerateInvoiceAIResponse> {
    const prepared = await this.prepareInvoiceData(
      text,
      context,
      history,
      "QUOTATION",
    );

    const { invoiceItems, warnings } = this.buildInvoiceItemsWithWarnings(
      prepared.mergedData,
      prepared.matchedServices,
    );

    const quotation = await quotationService.createQuotation(
      {
        customerId: prepared.customerResult.customer.id,
        issueDate: new Date().toISOString(),
        expiryDate: prepared.mergedData.dueDate || undefined,
        notes: prepared.mergedData.notes,
        termsConditions: prepared.mergedData.termsConditions,
        items: invoiceItems,
      },
      userId,
    );

    return {
      invoice: this.shapeDocumentResponse(quotation, "QUOTATION"),
      warnings: [...prepared.customerResult.warnings, ...warnings],
    };
  }

  async previewQuotation(
    text: string,
    userId?: string,
    context?: InvoiceContext,
    history: ConversationTurn[] = [],
  ): Promise<GenerateInvoiceAIResponse> {
    const prepared = await this.prepareInvoiceData(
      text,
      context,
      history,
      "QUOTATION",
    );

    const { invoiceItems, warnings } = this.buildInvoiceItemsWithWarnings(
      prepared.mergedData,
      prepared.matchedServices,
    );

    const totals = FinancialCalculations.calculateTotals(invoiceItems);

    const itemTotals = invoiceItems.map(
      (item) =>
        Math.round(FinancialCalculations.calculateItemTotal(item) * 100) / 100,
    );

    return {
      invoice: {
        id: "",
        invoiceNumber: "QTN-PREVIEW",
        status: "DRAFT",
        subtotal: Math.round(totals.subtotal * 100) / 100,
        discount: Math.round(totals.discount * 100) / 100,
        tax: Math.round(totals.tax * 100) / 100,
        total: Math.round(totals.total * 100) / 100,
        customer: {
          id: prepared.customerResult.customer.id,
          name: prepared.customerResult.customer.name,
          email: prepared.customerResult.customer.email,
        },
        items: invoiceItems.map((item, i) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Math.round(Number(item.unitPrice) * 100) / 100,
          discount: Math.round(Number(item.discount) * 100) / 100,
          taxRate: Number(item.taxRate),
          total: itemTotals[i],
        })),
      },
      warnings: [...prepared.customerResult.warnings, ...warnings],
    };
  }

  // ─────────────────────────────────────────────────────────────
  // PRIVATE — SHARED
  // ─────────────────────────────────────────────────────────────

  private shapeDocumentResponse(
    source: any,
    documentType: DocumentType,
  ): GenerateInvoiceAIResponse["invoice"] {
    const numberLabel =
      documentType === "QUOTATION"
        ? source.quotationNumber ?? ""
        : source.invoiceNumber ?? "";

    return {
      id: source.id,
      invoiceNumber: numberLabel,
      status: source.status,
      subtotal: Math.round(Number(source.subtotal) * 100) / 100,
      discount: Math.round(Number(source.discount) * 100) / 100,
      tax: Math.round(Number(source.tax) * 100) / 100,
      total: Math.round(Number(source.total) * 100) / 100,
      customer: {
        id: source.customer.id,
        name: source.customer.name,
        email: source.customer.email,
      },
      items: source.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Math.round(Number(item.unitPrice) * 100) / 100,
        discount: Math.round(Number(item.discount) * 100) / 100,
        taxRate: Number(item.taxRate),
        total: Math.round(Number(item.total) * 100) / 100,
      })),
    };
  }

  private async prepareInvoiceData(
    text: string,
    context: InvoiceContext | undefined,
    history: ConversationTurn[],
    documentType: DocumentType = "INVOICE",
  ): Promise<{
    mergedData: ParsedInvoiceData;
    customerResult: CustomerMatchResult;
    matchedServices: MatchedService[];
  }> {
    // Build history from context + conversation
    const contextTurns = this.contextToHistoryTurns(context);

    // Combine: context snapshot + actual conversation history
    const fullHistory = [...contextTurns, ...history];

    // Pass full history + document type to parser
    const parsedData = await invoiceAIParser.parseInvoiceText(
      text,
      fullHistory,
      documentType,
    );

    const mergedData = context
      ? this.mergeWithContext(parsedData, context)
      : parsedData;

    invoiceAIParser.validateParsedData(mergedData);

    // Check if services are empty
    if (!mergedData.items || mergedData.items.length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "Could not identify any service in your request",
        details: {
          suggestedServices: [],
          unmatchedServices: [],
          actions: [
            {
              type: "CREATE_SERVICE",
              label: "Create new service",
            },
          ],
        },
      });
    }

    const customerResult = await this.findCustomer(mergedData, context);
    const matchedServices = await this.matchServices(mergedData.items);

    const unmatchedServices = matchedServices.filter(
      (s) => !s.matched || s.suggestions?.length,
    );

    if (unmatchedServices.length > 0) {
      throw this.buildUnmatchedServiceError(unmatchedServices);
    }

    return { mergedData, customerResult, matchedServices };
  }

  private contextToHistoryTurns(context?: InvoiceContext): ConversationTurn[] {
    if (!context) return [];

    const hasAnyState =
      context.customerName ||
      (context.services && context.services.length > 0) ||
      context.dueDate ||
      context.notes ||
      context.termsConditions;

    if (!hasAnyState) return [];

    const snapshot = {
      error: false,
      customerName: context.customerName || "",
      items: (context.services || []).map((service) => ({
        serviceName: service.name,
        quantity: service.quantity || 1,
        discount: service.discount || 0,
        discountType: service.discountType || "percentage",
      })),
      dueDate: context.dueDate || "",
      notes: context.notes || "",
      termsConditions: context.termsConditions || "",
    };

    return [
      {
        role: "assistant",
        content: `Current invoice state: ${JSON.stringify(snapshot)}`,
      },
    ];
  }

  private mergeWithContext(
    parsed: ParsedInvoiceData,
    context: InvoiceContext,
  ): ParsedInvoiceData {
    const merged = { ...parsed };

    if (
      (!merged.customerName || merged.customerName.trim() === "") &&
      context.customerName
    ) {
      merged.customerName = context.customerName;
    }

    if (
      (!merged.items || merged.items.length === 0) &&
      context.services?.length
    ) {
      merged.items = context.services.map((service) => ({
        serviceName: service.name,
        description: service.name,
        quantity: service.quantity || 1,
        unitPrice: 0,
        discount: service.discount || 0,
        discountType: service.discountType || "percentage",
        taxRate: 0,
      }));
    }

    if (context.discount && merged.items && merged.items.length > 0) {
      merged.items = merged.items.map((item) => {
        if (!item.discount || item.discount === 0) {
          return {
            ...item,
            discount: context.discount || 0,
            discountType: context.discountType || "percentage",
          };
        }
        return item;
      });
    }

    if (!merged.dueDate && context.dueDate) {
      merged.dueDate = context.dueDate;
    }

    if (!merged.notes && context.notes) {
      merged.notes = context.notes;
    }

    if (!merged.termsConditions && context.termsConditions) {
      merged.termsConditions = context.termsConditions;
    }

    return merged;
  }

  private buildInvoiceItemsWithWarnings(
    mergedData: ParsedInvoiceData,
    matchedServices: MatchedService[],
  ): { invoiceItems: any[]; warnings: string[] } {
    const warnings: string[] = [];

    const invoiceItems = matchedServices.map((service, index) => {
      const parsedItem = mergedData.items[index];
      const dbPrice = service.matched!.unitPrice;
      const dbTaxRate = service.matched!.taxRate;
      const quantity = parsedItem.quantity || 1;
      const maxFixedDiscount = dbPrice * quantity;

      let discount = parsedItem.discount || 0;
      const discountType =
        parsedItem.discountType === "fixed" ? "fixed" : "percentage";

      if (discountType === "fixed" && discount > maxFixedDiscount) {
        warnings.push(
          `Discount ₹${discount} exceeds service price ₹${maxFixedDiscount} for "${service.matched!.name}". Capped at ₹${maxFixedDiscount}.`,
        );
        discount = maxFixedDiscount;
      }

      if (discountType === "percentage" && discount > 100) {
        warnings.push(
          `Discount ${discount}% exceeds 100% for "${service.matched!.name}". Capped at 100%.`,
        );
        discount = 100;
      }

      const discountPercentage = DiscountUtil.convertToPercentage(
        discount,
        discountType,
        dbPrice,
        quantity,
      );

      return {
        serviceId: service.matched!.id,
        description: service.matched!.name,
        quantity,
        unitPrice: dbPrice,
        taxRate: dbTaxRate,
        discount: Math.round(Math.min(discountPercentage, 100) * 100) / 100,
      };
    });

    return { invoiceItems, warnings };
  }

  private buildUnmatchedServiceError(
    unmatchedServices: MatchedService[],
  ): AppError {
    const servicesWithSuggestions = unmatchedServices.filter(
      (s) => s.suggestions && s.suggestions.length > 0,
    );
    const servicesWithoutSuggestions = unmatchedServices.filter(
      (s) => !s.suggestions || s.suggestions.length === 0,
    );

    return new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      message:
        servicesWithSuggestions.length > 0
          ? `Service "${servicesWithSuggestions[0].requested}" not found. Did you mean one of these?`
          : `Service "${servicesWithoutSuggestions[0]?.requested || "unknown"}" not found. Please create it first.`,
      details: {
        suggestedServices: servicesWithSuggestions.map((s) => ({
          requested: s.requested,
          suggestions: s.suggestions || [],
        })),
        unmatchedServices: servicesWithoutSuggestions.map((s) => ({
          requested: s.requested,
          message: `Service "${s.requested}" not found. Please create it first.`,
        })),
        actions: servicesWithoutSuggestions.map((s) => ({
          type: "CREATE_SERVICE",
          label: `Create new service "${s.requested}"`,
        })),
      },
    });
  }

  private async findCustomer(
    parsedData: ParsedInvoiceData,
    context?: InvoiceContext,
  ): Promise<CustomerMatchResult> {
    const warnings: string[] = [];

    if (context?.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: context.customerId },
      });

      if (customer) {
        return {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            isNew: false,
          },
          warnings,
        };
      }
    }

    const orConditions: any[] = [
      { name: { equals: parsedData.customerName, mode: "insensitive" } },
    ];

    if (parsedData.customerEmail) {
      orConditions.push({
        email: { equals: parsedData.customerEmail, mode: "insensitive" },
      });
    }

    if (parsedData.customerPhone) {
      orConditions.push({
        phone: { equals: parsedData.customerPhone },
      });
    }

    const exactCustomer = await prisma.customer.findFirst({
      where: {
        OR: orConditions,
      },
    });

    if (exactCustomer) {
      return {
        customer: {
          id: exactCustomer.id,
          name: exactCustomer.name,
          email: exactCustomer.email,
          phone: exactCustomer.phone,
          isNew: false,
        },
        warnings,
      };
    }

    const suggestions = await invoiceAISuggestions.suggestCustomers(
      parsedData.customerName,
    );

    if (suggestions.length > 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: `Customer "${parsedData.customerName}" not found. Did you mean one of these?`,
        details: {
          suggestedCustomers: suggestions,
          actions: [
            {
              type: "CREATE_CUSTOMER",
              label: `Create new customer "${parsedData.customerName}"`,
            },
          ],
        },
      });
    }

    throw new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      message: `Customer "${parsedData.customerName}" not found`,
      details: {
        actions: [
          {
            type: "CREATE_CUSTOMER",
            label: `Create new customer "${parsedData.customerName}"`,
          },
        ],
      },
    });
  }

  private async matchServices(
    items: ParsedInvoiceItem[],
  ): Promise<MatchedService[]> {
    const allServices = await prisma.service.findMany({
      include: {
        category: true,
      },
    });

    return Promise.all(
      items.map(async (item) => {
        const searchTerm = item.serviceName.toLowerCase().trim();
        const searchWords = searchTerm.split(/[\s-]+/).filter(Boolean);

        const exactMatch = allServices.find(
          (service) => service.name.toLowerCase() === searchTerm,
        );

        if (exactMatch) {
          return {
            requested: item.serviceName,
            matched: {
              id: exactMatch.id,
              name: exactMatch.name,
              unitPrice: Number(exactMatch.price),
              taxRate: Number(exactMatch.taxRate),
            },
            confidence: 100,
          };
        }

        const scoredServices = allServices.map((service) => {
          const serviceName = service.name.toLowerCase();
          const serviceWords = serviceName.split(/[\s-]+/).filter(Boolean);

          let score = 0;

          searchWords.forEach((word) => {
            if (word.length < 3) return;

            if (serviceName === word) {
              score += 100;
            } else if (serviceName.includes(word)) {
              score += 50;
            } else if (serviceWords.some((sw) => sw.includes(word))) {
              score += 40;
            }
          });

          const matchedWordsCount = searchWords.filter((word) =>
            serviceName.includes(word),
          ).length;

          if (matchedWordsCount > 1) {
            score += matchedWordsCount * 30;
          }

          return { service, score };
        });

        const matchedServices = scoredServices
          .filter((s) => s.score > 0)
          .sort((a, b) => b.score - a.score);

        if (matchedServices.length === 0) {
          return {
            requested: item.serviceName,
            matched: null,
            confidence: 0,
            suggestions: [],
          };
        }

        const bestMatch = matchedServices[0];
        const secondBest = matchedServices[1];

        if (!secondBest || bestMatch.score >= secondBest.score + 30) {
          return {
            requested: item.serviceName,
            matched: {
              id: bestMatch.service.id,
              name: bestMatch.service.name,
              unitPrice: Number(bestMatch.service.price),
              taxRate: Number(bestMatch.service.taxRate),
            },
            confidence: bestMatch.score >= 100 ? 90 : 70,
          };
        }

        return {
          requested: item.serviceName,
          matched: null,
          confidence: 0,
          suggestions: matchedServices.slice(0, 3).map((s) => ({
            id: s.service.id,
            serviceCode: s.service.serviceCode,
            name: s.service.name,
            price: Number(s.service.price),
            taxRate: Number(s.service.taxRate),
            categoryName: s.service.category?.name || null,
          })),
        };
      }),
    );
  }
}

export const invoiceAIService = new InvoiceAIService();