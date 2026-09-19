import { ServiceSuggestion } from "./invoiceAI.suggestions";

export type DocumentType = "INVOICE" | "QUOTATION";

export interface ParsedInvoiceItem {
  serviceName: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  discount: number;
  discountType: "percentage" | "fixed";
  taxRate?: number;
}

export interface ParsedInvoiceData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: ParsedInvoiceItem[];
  dueDate?: string;
  notes?: string;
  termsConditions?: string;
}

export interface MatchedService {
  requested: string;
  matched: {
    id: string;
    name: string;
    unitPrice: number;
    taxRate: number;
  } | null;
  confidence: number;
  suggestions?: ServiceSuggestion[];
}

export interface CustomerMatchResult {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    isNew: boolean;
  };
  warnings: string[];
}

export interface CleanInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface CleanInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customer: {
    id: string;
    name: string;
    email: string | null;
  };
  items: CleanInvoiceItem[];
}

export interface GenerateInvoiceAIResponse {
  invoice: CleanInvoice;
  warnings: string[];
}

export interface InvoiceContext {
  customerName?: string;
  customerId?: string;
  services?: Array<{
    id?: string;
    name: string;
    quantity?: number;
    discount?: number;
    discountType?: "percentage" | "fixed";
  }>;
  discount?: number;
  discountType?: "percentage" | "fixed";
  dueDate?: string;
  notes?: string;
  termsConditions?: string;
}