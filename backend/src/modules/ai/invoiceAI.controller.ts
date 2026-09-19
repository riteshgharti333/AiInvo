import type { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { apiResponse } from "../../common/utils/apiResponse";
import { HTTP_STATUS } from "../../common/constants/httpStatus";
import { AppError } from "../../common/errors/AppError";
import { invoiceAIService } from "./invoiceAI.service";
import type { InvoiceContext } from "./invoiceAI.types";
import type { ConversationTurn } from "./invoiceAI.parser";

class InvoiceAIController {
  // INVOICE

  generateInvoice = asyncHandler(async (req: Request, res: Response) => {
    const { text, context, history } = req.body;
    const userId = (req as any).user?.id;

    if (!text || text.trim().length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: "Please provide invoice text",
      });
    }

    const result = await invoiceAIService.generateInvoiceFromText(
      text,
      userId,
      context as InvoiceContext,
      history as ConversationTurn[],
    );

    return apiResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Invoice generated successfully",
      data: result,
    });
  });

  testParse = asyncHandler(async (req: Request, res: Response) => {
    const { text, context, history } = req.body;
    const userId = (req as any).user?.id;

    if (!text || text.trim().length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: "Please provide text to parse",
      });
    }

    const result = await invoiceAIService.previewInvoice(
      text,
      userId,
      context as InvoiceContext,
      history as ConversationTurn[],
    );

    return apiResponse({
      res,
      message: "Invoice preview generated successfully",
      data: result,
    });
  });

  // QUOTATION

  generateQuotation = asyncHandler(async (req: Request, res: Response) => {
    const { text, context, history } = req.body;
    const userId = (req as any).user?.id;

    if (!text || text.trim().length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: "Please provide quotation text",
      });
    }

    const result = await invoiceAIService.generateQuotationFromText(
      text,
      userId,
      context as InvoiceContext,
      history as ConversationTurn[],
    );

    return apiResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Quotation generated successfully",
      data: result,
    });
  });

  testParseQuotation = asyncHandler(async (req: Request, res: Response) => {
    const { text, context, history } = req.body;
    const userId = (req as any).user?.id;

    if (!text || text.trim().length === 0) {
      throw new AppError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: "Please provide text to parse",
      });
    }

    const result = await invoiceAIService.previewQuotation(
      text,
      userId,
      context as InvoiceContext,
      history as ConversationTurn[],
    );

    return apiResponse({
      res,
      message: "Quotation preview generated successfully",
      data: result,
    });
  });
}

export const invoiceAIController = new InvoiceAIController();
