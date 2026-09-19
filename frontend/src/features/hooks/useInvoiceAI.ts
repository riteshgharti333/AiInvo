import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  invoiceAIApi,
  quotationAIApi,
  type AIRequest,
} from "../api/invoiceAI.api";
import { invoiceKeys } from "./useInvoices";
import { toast } from "../../utils/toast";

// ─────────────────────────────────────────────────────────────
// INVOICE hooks (existing — unchanged behavior)
// ─────────────────────────────────────────────────────────────

export function useInvoiceAIPreview() {
  return useMutation({
    mutationFn: (data: AIRequest) => invoiceAIApi.preview(data),
  });
}

export function useInvoiceAIGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AIRequest) => invoiceAIApi.generate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      toast.success(data.message || "Invoice generated successfully");
    },
  });
}

// ─────────────────────────────────────────────────────────────
// QUOTATION hooks (new)
// ─────────────────────────────────────────────────────────────

export function useQuotationAIPreview() {
  return useMutation({
    mutationFn: (data: AIRequest) => quotationAIApi.preview(data),
  });
}

export function useQuotationAIGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AIRequest) => quotationAIApi.generate(data),
    onSuccess: (data) => {
      // Adjust to your quotation query keys — if you have quotationKeys
      queryClient.invalidateQueries({ queryKey: ["quotations", "lists"] });
      toast.success(data.message || "Quotation generated successfully");
    },
  });
}