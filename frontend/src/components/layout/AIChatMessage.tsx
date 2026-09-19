import { motion } from "framer-motion";
import {
  TbFileInvoice,
  TbUserPlus,
  TbFilter2Plus,
  TbCheck,
  TbSparkles,
  TbPackage,
  TbFileDescription,
} from "react-icons/tb";
import type {
  InvoiceAIPreview,
  CustomerSuggestion,
  ServiceSuggestion,
  InvoiceContext,
} from "@invoice/shared/types";
import {
  useInvoiceAIGenerate,
  useQuotationAIGenerate,
} from "../../features/hooks/useInvoiceAI";
import { useNavigate } from "react-router-dom";
import { toast } from "../../utils/toast";
import { useState } from "react";
import { PopupBottomRight } from "./PopupBottomRight";
import { NewCustomerForm } from "./NewCustomerForm";

export type ChatErrorType =
  | "CUSTOMER_NOT_FOUND"
  | "SERVICE_NOT_FOUND"
  | "INVALID_INPUT";

export type DocumentType = "INVOICE" | "QUOTATION";

export interface ChatMessageData {
  id: string;
  type: "user" | "ai";
  text: string;
  sourceText?: string;
  preview?: InvoiceAIPreview;
  documentType?: DocumentType;
  error?: {
    message: string;
    type: ChatErrorType;
    customerName?: string;
    serviceNames?: string[];
    suggestions?: any[];
  };
  isThinking?: boolean;
}

interface AIChatMessageProps {
  message: ChatMessageData;
  context?: InvoiceContext;
  onUpdateContext?: (context: InvoiceContext) => void;
  onSelectCustomer?: (customer: CustomerSuggestion) => void;
  onSelectService?: (service: ServiceSuggestion) => void;
  isSelecting?: boolean;
  onClose?: () => void;
}

export function AIChatMessage({
  message,
  context,
  onSelectCustomer,
  onSelectService,
  isSelecting,
  onClose,
}: AIChatMessageProps) {
  const navigate = useNavigate();

  const isQuotation = message.documentType === "QUOTATION";

  const invoiceGenerate = useInvoiceAIGenerate();
  const quotationGenerate = useQuotationAIGenerate();
  const generateMutation = isQuotation ? quotationGenerate : invoiceGenerate;
  const isGenerating = generateMutation.isPending;

  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");

  const handleGenerate = async () => {
    const requestText = message.sourceText || message.text;

    if (!requestText) {
      toast.error(
        "Couldn't find the original request for this preview. Please try again.",
      );
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        text: requestText,
        context:
          context && Object.keys(context).length > 0 ? context : undefined,
      });

      const docId = result.data.invoice.id;

      if (isQuotation) {
        toast.success("Quotation created successfully!");
        onClose?.();
        if (docId) navigate(`/quotation/${docId}`);
        else navigate("/quotations");
      } else {
        toast.success("Invoice created successfully!");
        onClose?.();
        if (docId) navigate(`/invoice/${docId}`);
        else navigate("/invoices");
      }
    } catch (error: any) {
      // toast.error(...)
    }
  };

  const goToCreateCustomer = (name: string) => {
    setNewCustomerName(name);
    setShowNewCustomer(true);
  };

  const goToCreateService = (name: string) => {
    navigate("/services/new", { state: { name } });
  };

  // User Message
  if (message.type === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md text-sm shadow-sm">
          {message.text}
        </div>
      </motion.div>
    );
  }

  // AI Thinking
  if (message.isThinking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl rounded-bl-md border border-gray-100 shadow-sm">
          <TbSparkles size={16} className="text-blue-600 animate-pulse" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                className="w-2 h-2 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // AI Error with Suggestions  (unchanged)
  if (message.error) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="max-w-[90%] bg-white border border-gray-200 rounded-2xl rounded-bl-md overflow-hidden shadow-sm">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <TbSparkles size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {message.error.message}
                  </p>

                  {/* Customer Suggestions */}
                  {message.error.type === "CUSTOMER_NOT_FOUND" &&
                    message.error.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.error.suggestions.map(
                          (customer: CustomerSuggestion, index: number) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => onSelectCustomer?.(customer)}
                              disabled={isSelecting}
                              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                                {customer.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {customer.name}
                                </p>
                                {customer.email && (
                                  <p className="text-[10px] text-gray-500 truncate">
                                    {customer.email}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                                Select →
                              </span>
                            </motion.button>
                          ),
                        )}

                        <div className="flex items-center gap-3 py-1">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                            or
                          </span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <button
                          onClick={() =>
                            goToCreateCustomer(message.error!.customerName!)
                          }
                          className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30"
                        >
                          <TbUserPlus size={16} />
                          <span>Create new customer</span>
                        </button>
                      </div>
                    )}

                  {/* Service Suggestions */}
                  {message.error.type === "SERVICE_NOT_FOUND" && (
                    <div className="mt-3 space-y-2">
                      {message.error.suggestions &&
                        message.error.suggestions.length > 0 && (
                          <>
                            {message.error.suggestions.map(
                              (suggestion: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <p className="text-xs font-medium text-gray-700">
                                    Did you mean one of these for "
                                    {suggestion.requested}"?
                                  </p>
                                  {suggestion.suggestions?.map(
                                    (
                                      service: ServiceSuggestion,
                                      sIndex: number,
                                    ) => (
                                      <motion.button
                                        key={sIndex}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: sIndex * 0.1 }}
                                        onClick={() =>
                                          onSelectService?.(service)
                                        }
                                        disabled={isSelecting}
                                        className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                          <TbPackage size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium text-gray-900 truncate">
                                            {service.name}
                                          </p>
                                          <p className="text-[10px] text-gray-500">
                                            ₹
                                            {service.price?.toLocaleString?.() ||
                                              service.price}
                                          </p>
                                        </div>
                                        <span className="text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                                          Select →
                                        </span>
                                      </motion.button>
                                    ),
                                  )}
                                </div>
                              ),
                            )}
                          </>
                        )}

                      {message.error.serviceNames &&
                        message.error.serviceNames.length > 0 && (
                          <div className="flex items-center gap-3 py-1">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                              or
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>
                        )}

                      {message.error.serviceNames &&
                        message.error.serviceNames.length > 0 && (
                          <>
                            {message.error.serviceNames.map(
                              (service, index) => (
                                <button
                                  key={`create-${index}`}
                                  onClick={() => goToCreateService(service)}
                                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                >
                                  <TbFilter2Plus size={16} />
                                  <span>Create new service</span>
                                </button>
                              ),
                            )}
                          </>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {showNewCustomer && (
          <PopupBottomRight
            isOpen={showNewCustomer}
            onClose={() => setShowNewCustomer(false)}
            title="New Customer"
            subtitle="Quick create — add a customer instantly"
          >
            <NewCustomerForm
              onSuccess={() => {
                setShowNewCustomer(false);
                onClose?.();
              }}
              onCancel={() => setShowNewCustomer(false)}
            />
          </PopupBottomRight>
        )}
      </>
    );
  }

  // AI Preview
  if (message.preview) {
    const { invoice } = message.preview;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="max-w-[90%] bg-white border border-gray-200 rounded-2xl rounded-bl-md overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 flex items-center gap-2">
            {isQuotation ? (
              <TbFileDescription size={14} className="text-blue-600" />
            ) : (
              <TbFileInvoice size={14} className="text-blue-600" />
            )}
            <span className="text-xs font-semibold text-gray-900">
              {isQuotation ? "Quotation Preview" : "Invoice Preview"}
            </span>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                {invoice.customer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {invoice.customer.name}
                </p>
                {invoice.customer.email && (
                  <p className="text-xs text-gray-500">
                    {invoice.customer.email}
                  </p>
                )}
              </div>
              <TbCheck size={16} className="text-green-500" />
            </div>

            <div className="space-y-2">
              {(invoice.items || []).map((item: any, index: number) => (
                <div key={index} className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Qty {item.quantity}
                        {Number(item.discount) > 0 &&
                          ` · ${item.discount}% off`}
                      </p>
                    </div>
                    <p className="text-xs font-semibold font-mono text-gray-900 shrink-0">
                      ₹{item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span className="font-mono">
                  ₹{invoice.subtotal.toLocaleString()}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-xs text-red-500">
                  <span>Discount</span>
                  <span className="font-mono">
                    -₹{invoice.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tax</span>
                <span className="font-mono">
                  ₹{invoice.tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="font-mono text-blue-600">
                  ₹{invoice.total.toLocaleString()}
                </span>
              </div>
            </div>

            {(message.preview.warnings || []).length > 0 && (
              <div className="flex gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                <TbSparkles
                  size={14}
                  className="text-amber-500 mt-0.5 shrink-0"
                />
                <div className="space-y-1">
                  {(message.preview.warnings || []).map(
                    (warning: string, index: number) => (
                      <p
                        key={index}
                        className="text-xs text-amber-700 leading-snug"
                      >
                        {warning}
                      </p>
                    ),
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
            >
              {isGenerating
                ? "Creating…"
                : isQuotation
                  ? "Confirm & Create Quotation"
                  : "Confirm & Create Invoice"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="px-4 py-2.5 bg-white text-gray-900 rounded-2xl rounded-bl-md text-sm border border-gray-100 shadow-sm">
        {message.text}
      </div>
    </motion.div>
  );
}