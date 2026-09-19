import { Router } from "express";
import { invoiceAIController } from "./invoiceAI.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/authorize.middleware";

const router = Router();

// ─────────────────────────────────────────────────────────────
// INVOICE — ADMIN only
// ─────────────────────────────────────────────────────────────

router.post(
  "/generate",
  authMiddleware,
  authorize("ADMIN"),
  invoiceAIController.generateInvoice,
);

router.post(
  "/preview",
  authMiddleware,
  authorize("ADMIN"),
  invoiceAIController.testParse,
);

// ─────────────────────────────────────────────────────────────
// QUOTATION — any authenticated user
// ─────────────────────────────────────────────────────────────

router.post(
  "/generate-quotation",
  authMiddleware,
  invoiceAIController.generateQuotation,
);

router.post(
  "/preview-quotation",
  authMiddleware,
  invoiceAIController.testParseQuotation,
);

export { router as invoiceAIRouter };