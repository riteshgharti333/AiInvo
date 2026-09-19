import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { getDueReminderTemplate, getOverdueTemplate } from "./email.templates";

class EmailService {
  private transporter: nodemailer.Transporter;
  private cutoffDate: Date;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    this.cutoffDate = new Date(2026, 7, 1);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info("Email service connected successfully");
      return true;
    } catch (error) {
      logger.error("Email service connection failed:", error);
      return false;
    }
  }

  async sendDueReminder(data: {
    to: string;
    customerName: string;
    invoiceNumber: string;
    total: string;
    remainingBalance: string;
    dueDate: string;
    invoiceCreatedAt: Date;
  }): Promise<boolean> {
    try {
      if (new Date(data.invoiceCreatedAt) < this.cutoffDate) {
        logger.info(
          `Skipping due reminder for ${data.invoiceNumber} - created before Aug 1, 2026`,
        );
        return false;
      }

      const { subject, html } = getDueReminderTemplate({
        customerName: data.customerName,
        invoiceNumber: data.invoiceNumber,
        total: data.total,
        remainingBalance: data.remainingBalance,
        dueDate: data.dueDate,
        customerEmail: data.to,
      });

      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: data.to,
        subject: subject,
        html: html,
      });

      logger.info(
        `Due reminder email sent to ${data.to} for invoice ${data.invoiceNumber}`,
      );
      return true;
    } catch (error) {
      logger.error(
        `Failed to send due reminder for ${data.invoiceNumber}:`,
        error,
      );
      return false;
    }
  }

  async sendOverdueAlert(data: {
    to: string;
    customerName: string;
    invoiceNumber: string;
    total: string;
    remainingBalance: string;
    dueDate: string;
    invoiceCreatedAt: Date;
  }): Promise<boolean> {
    try {
      if (new Date(data.invoiceCreatedAt) < this.cutoffDate) {
        logger.info(
          `Skipping overdue alert for ${data.invoiceNumber} - created before Aug 1, 2026`,
        );
        return false;
      }

      const { subject, html } = getOverdueTemplate({
        customerName: data.customerName,
        invoiceNumber: data.invoiceNumber,
        total: data.total,
        remainingBalance: data.remainingBalance,
        dueDate: data.dueDate,
        customerEmail: data.to,
      });

      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: data.to,
        subject: subject,
        html: html,
      });

      logger.info(
        `Overdue email sent to ${data.to} for invoice ${data.invoiceNumber}`,
      );
      return true;
    } catch (error) {
      logger.error(
        `Failed to send overdue alert for ${data.invoiceNumber}:`,
        error,
      );
      return false;
    }
  }

  async sendInvoicePdf(data: {
    to: string;
    customerName: string;
    invoiceNumber: string;
    total: string;
    remainingBalance: string;
    dueDate: string;
    pdfBuffer: Buffer;
    type?: "invoice" | "quotation"; // ADD THIS
  }): Promise<boolean> {
    try {
      const isQuotation = data.type === "quotation";
      const docType = isQuotation ? "Quotation" : "Invoice";
      const docNumber = isQuotation
        ? `Quotation #${data.invoiceNumber}`
        : `Invoice #${data.invoiceNumber}`;
      const dateLabel = isQuotation ? "Expiry Date" : "Due Date";
      const filename = isQuotation
        ? `Quotation_${data.invoiceNumber}.pdf`
        : `Invoice_${data.invoiceNumber}.pdf`;

      const subject = `${data.invoiceNumber} - AiInvo`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #4F46E5; text-align: center; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${docType} Attached</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${data.customerName}</strong>,</p>
              <p>Please find your ${docType.toLowerCase()} attached to this email.</p>
              <div class="details">
                <p><strong>${docNumber}</strong></p>
                <p><strong>Amount:</strong> ₹${data.total}</p>
                ${!isQuotation ? `<p><strong>Remaining Balance:</strong> ₹${data.remainingBalance}</p>` : ""}
                <p><strong>${dateLabel}:</strong> ${data.dueDate}</p>
              </div>
              <div class="amount">₹${isQuotation ? data.total : data.remainingBalance}</div>
              <p>Thank you for your business!</p>
              <p>AiInvo Team</p>
            </div>
            <div class="footer">
              <p>This email was sent from AiInvo.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: data.to,
        subject: subject,
        html: html,
        attachments: [
          {
            filename: filename,
            content: data.pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      logger.info(
        `${docType} PDF sent to ${data.to} for ${data.invoiceNumber}`,
      );
      return true;
    } catch (error) {
      logger.error(`Failed to send PDF for ${data.invoiceNumber}:`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
