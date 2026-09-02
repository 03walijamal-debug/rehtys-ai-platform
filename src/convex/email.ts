import { v } from "convex/values";
import { action } from "./_generated/server";

// ─── BREVO EMAIL CLIENT ──────────────────────────────────
async function sendBrevoEmail(args: {
  to: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not set");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: args.senderName || "Rehtys AI",
        email: "noreply@rehtys.com",
      },
      to: [{ email: args.to }],
      subject: args.subject,
      htmlContent: args.htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }

  return await response.json();
}

// ─── SEND WELCOME EMAIL ──────────────────────────────────
export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0B0F1A; color: #F9FAFB; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.2); }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); padding: 40px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; color: white; }
          .content { padding: 32px; }
          .content p { color: #9CA3AF; line-height: 1.6; margin: 16px 0; }
          .content strong { color: #F9FAFB; }
          .btn { display: inline-block; background: #8B5CF6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 24px 0; }
          .footer { padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #6B7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Rehtys AI! 🚀</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${args.name}</strong>,</p>
            <p>Welcome aboard! Your AI-powered customer support platform is ready. Here's what you can do:</p>
            <p>🤖 <strong>Create AI Agents</strong> — Build custom chatbots trained on your business knowledge</p>
            <p>📚 <strong>Upload Documents</strong> — Add FAQs, policies, and product info to train your agents</p>
            <p>📊 <strong>Track Analytics</strong> — Monitor conversations and performance in real-time</p>
            <p>🔗 <strong>Embed Anywhere</strong> — Add the chat widget to any website with one line of code</p>
            <p style="text-align: center;">
              <a href="https://rehtys-ai-platform.vercel.app/dashboard" class="btn">Go to Dashboard →</a>
            </p>
            <p>Need help? Just reply to this email!</p>
          </div>
          <div class="footer">
            <p>© 2025 Rehtys AI Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendBrevoEmail({
      to: args.email,
      subject: "Welcome to Rehtys AI Platform! 🚀",
      htmlContent,
    });
  },
});

// ─── SEND USAGE ALERT ────────────────────────────────────
export const sendUsageAlert = action({
  args: {
    email: v.string(),
    name: v.string(),
    messagesUsed: v.number(),
    messagesLimit: v.number(),
  },
  handler: async (ctx, args) => {
    const percentage = Math.round((args.messagesUsed / args.messagesLimit) * 100);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0B0F1A; color: #F9FAFB; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.3); }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); padding: 32px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; color: white; }
          .content { padding: 32px; }
          .content p { color: #9CA3AF; line-height: 1.6; margin: 16px 0; }
          .progress-bar { background: #374151; border-radius: 8px; height: 12px; margin: 20px 0; overflow: hidden; }
          .progress-fill { background: linear-gradient(90deg, #F59E0B, #EF4444); height: 100%; width: ${percentage}%; border-radius: 8px; }
          .btn { display: inline-block; background: #8B5CF6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 24px 0; }
          .footer { padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #6B7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Usage Alert</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${args.name}</strong>,</p>
            <p>You've used <strong>${percentage}%</strong> of your monthly message limit.</p>
            <div class="progress-bar"><div class="progress-fill"></div></div>
            <p><strong>${args.messagesUsed.toLocaleString()}</strong> / ${args.messagesLimit.toLocaleString()} messages used</p>
            <p>Upgrade to continue building your AI agents without limits!</p>
            <p style="text-align: center;">
              <a href="https://rehtys-ai-platform.vercel.app/dashboard/billing" class="btn">Upgrade Plan →</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Rehtys AI Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendBrevoEmail({
      to: args.email,
      subject: `⚠️ You've used ${percentage}% of your message limit`,
      htmlContent,
    });
  },
});

// ─── SEND BILLING RECEIPT ────────────────────────────────
export const sendBillingReceipt = action({
  args: {
    email: v.string(),
    name: v.string(),
    plan: v.string(),
    amount: v.string(),
  },
  handler: async (ctx, args) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0B0F1A; color: #F9FAFB; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.3); }
          .header { background: linear-gradient(135deg, #10B981 0%, #06B6D4 100%); padding: 32px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; color: white; }
          .content { padding: 32px; }
          .content p { color: #9CA3AF; line-height: 1.6; margin: 16px 0; }
          .receipt { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .footer { padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #6B7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${args.name}</strong>,</p>
            <p>Your payment has been processed successfully!</p>
            <div class="receipt">
              <div class="receipt-row"><span>Plan</span><span><strong>${args.plan}</strong></span></div>
              <div class="receipt-row"><span>Amount</span><span><strong>${args.amount}</strong></span></div>
              <div class="receipt-row"><span>Date</span><span><strong>${new Date().toLocaleDateString()}</strong></span></div>
            </div>
            <p>Thank you for supporting Rehtys AI! Your agents are ready to work for you.</p>
          </div>
          <div class="footer">
            <p>© 2025 Rehtys AI Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendBrevoEmail({
      to: args.email,
      subject: `✅ Payment Confirmed — ${args.plan} Plan`,
      htmlContent,
    });
  },
});
