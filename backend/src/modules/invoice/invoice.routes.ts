import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware";
import { invoiceController } from "./invoice.controller";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
} from "@invoice/shared";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/authorize.middleware";
import { invoiceAIController } from "../ai/invoiceAI.controller";

const router = Router();

// AI routes (must be before /:id routes)
// router.post("/generate", authMiddleware, invoiceAIController.generateInvoice);
// router.post("/test-parse", authMiddleware, invoiceAIController.testParse);

// Regular invoice routes
router.get("/", invoiceController.getAllInvoices);
router.get("/search", invoiceController.searchInvoices);
router.get("/filter", invoiceController.filterInvoices);
router.get("/:id", invoiceController.getInvoiceById);

router.post("/:id/send-pdf", authMiddleware, invoiceController.sendPdf);

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(createInvoiceSchema),
  invoiceController.createInvoice,
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  validate(updateInvoiceSchema),
  invoiceController.updateInvoice,
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorize("ADMIN"),
  validate(updateInvoiceStatusSchema),
  invoiceController.updateInvoiceStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  invoiceController.deleteInvoice,
);

export { router as invoiceRouter };
