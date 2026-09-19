interface EmailTemplateData {
  customerName: string;
  invoiceNumber: string;
  total: string;
  remainingBalance: string;
  dueDate: string;
  customerEmail: string;
}

export function getDueReminderTemplate(data: EmailTemplateData): {
  subject: string;
  html: string;
} {
  const subject = `Reminder: Invoice #${data.invoiceNumber} Due in 2 Days`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .details table { width: 100%; border-collapse: collapse; }
        .details td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .details td:first-child { font-weight: bold; color: #666; }
        .amount { font-size: 28px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice Reminder</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${data.customerName}</strong>,</p>
          
          <p>This is a friendly reminder that your invoice is due in <strong>2 days</strong>. Please review the details below:</p>
          
          <div class="details">
            <table>
              <tr>
                <td>Invoice Number</td>
                <td>#${data.invoiceNumber}</td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>${data.dueDate}</td>
              </tr>
              <tr>
                <td>Customer</td>
                <td>${data.customerName}</td>
              </tr>
            </table>
          </div>
          
                  <div style="text-align: center; margin: 20px 0;">
  <div style="font-size: 32px; font-weight: bold; color: #667eea;">
    ₹${data.remainingBalance}
  </div>
  <div style="font-size: 14px; color: #666; margin-top: 5px;">
    remaining out of ₹${data.total}
  </div>
</div>
          
          <p>Please make the payment at your earliest convenience to avoid any service interruption.</p>
          
          <p>If you have already made the payment, please ignore this email.</p>
          
          <p>Best regards,<br>AiInvo Team</p>
        </div>
        <div class="footer">
          <p>This is an automated reminder from AiInvo. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export function getOverdueTemplate(data: EmailTemplateData): {
  subject: string;
  html: string;
} {
  const subject = `URGENT: Invoice #${data.invoiceNumber} is Overdue`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ef4444; }
        .details table { width: 100%; border-collapse: collapse; }
        .details td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .details td:first-child { font-weight: bold; color: #666; }
        .amount { font-size: 28px; font-weight: bold; color: #ef4444; text-align: center; margin: 20px 0; }
        .urgent { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; color: #dc2626; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Overdue Invoice</h1>
        </div>
        <div class="content">
          <div class="urgent">
            Your payment is now overdue
          </div>
          
          <p>Dear <strong>${data.customerName}</strong>,</p>
          
          <p>Your invoice is now <strong>overdue</strong>. Please clear the pending amount immediately to avoid any service interruption.</p>
          
          <div class="details">
            <table>
              <tr>
                <td>Invoice Number</td>
                <td>#${data.invoiceNumber}</td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>${data.dueDate}</td>
              </tr>
              <tr>
                <td>Customer</td>
                <td>${data.customerName}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td style="color: #ef4444; font-weight: bold;">OVERDUE</td>
              </tr>
            </table>
          </div>
            
                  <div style="text-align: center; margin: 20px 0;">
  <div style="font-size: 32px; font-weight: bold; color: #667eea;">
    ₹${data.remainingBalance}
  </div>
  <div style="font-size: 14px; color: #666; margin-top: 5px;">
    remaining out of ₹${data.total}
  </div>
</div>
          
          <p>If payment has already been made, please ignore this message.</p>
          
          <p>If you have any questions, please contact us immediately.</p>
          
          <p>Best regards,<br>AiInvo Team</p>
        </div>
        <div class="footer">
          <p>This is an automated reminder from AiInvo. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
