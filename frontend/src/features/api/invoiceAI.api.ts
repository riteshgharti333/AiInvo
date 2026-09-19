import type { InvoiceAIPreview, InvoiceContext } from "@invoice/shared/types";
import axiosInstance from "../../utils/axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AIRequest {
  text: string;
  context?: InvoiceContext;
  history?: ConversationTurn[];
}

// ─────────────────────────────────────────────────────────────
// INVOICE (ADMIN) — /invoice-ai/*
// ─────────────────────────────────────────────────────────────

export const invoiceAIApi = {
  preview: (data: AIRequest) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice-ai/preview", data)
      .then((res) => res.data),

  generate: (data: AIRequest) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice-ai/generate", data)
      .then((res) => res.data),
};

// ─────────────────────────────────────────────────────────────
// QUOTATION (any user) — /invoice-ai/*
// ─────────────────────────────────────────────────────────────

export const quotationAIApi = {
  preview: (data: AIRequest) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice-ai/preview-quotation", data)
      .then((res) => res.data),

  generate: (data: AIRequest) =>
    axiosInstance
      .post<ApiResponse<InvoiceAIPreview>>("/invoice-ai/generate-quotation", data)
      .then((res) => res.data),
};