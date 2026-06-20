import nodemailer from "nodemailer";
import { mailConfig, telegramConfig } from "../config";

// ─── Transport primitives ───────────────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport(mailConfig);
  }
  return _transporter;
}

async function email(to: string, subject: string, html: string): Promise<void> {
  await getTransporter().sendMail({ from: mailConfig.from, to, subject, html });
}

async function telegram(chatId: string, text: string): Promise<void> {
  if (!telegramConfig.token) return;
  await fetch(`https://api.telegram.org/bot${telegramConfig.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

// WhatsApp via Telegram bot bridge — placeholder, wired when provider is chosen
async function whatsapp(_phone: string, _text: string): Promise<void> {
  // TODO: wire WhatsApp provider (Twilio, WATI, etc.)
}

// ─── Notification events ────────────────────────────────────────────────────
// Each function is one event. Add channels here — never scatter sends across service files.

export const notify = {
  /**
   * Sent when an admin invites a new user.
   * Channels: email (always) + Telegram personal (if chatId known)
   */
  async userInvited(params: {
    toEmail: string;
    role: string;
    inviteUrl: string;
    accessCode: string;
    telegramChatId?: string | null;
  }) {
    const subject = "You've been invited to Govexa";
    const html = `
      <p>You have been invited to join Govexa as <strong>${params.role}</strong>.</p>
      <p><a href="${params.inviteUrl}">Accept invitation</a></p>
      <p>Or enter this access code on the login page: <code>${params.accessCode}</code></p>
      <p>This invitation expires in 48 hours.</p>`;

    await email(params.toEmail, subject, html);

    if (params.telegramChatId) {
      await telegram(
        params.telegramChatId,
        `🎉 You've been invited to Govexa as <b>${params.role}</b>.\n\nAccept here: ${params.inviteUrl}`,
      );
    }
  },

  /**
   * Welcome message after a user accepts their invitation.
   * Channels: email + Telegram personal
   */
  async welcomeUser(params: { toEmail: string; name: string; telegramChatId?: string | null }) {
    await email(
      params.toEmail,
      "Welcome to Govexa",
      `<p>Hi ${params.name}, your Govexa account is now active. Welcome aboard!</p>`,
    );
    if (params.telegramChatId) {
      await telegram(params.telegramChatId, `Welcome to Govexa, <b>${params.name}</b>! Your account is now active.`);
    }
  },

  /**
   * Parent notification: student boarded the bus.
   * Channels: Telegram personal + WhatsApp (future)
   */
  async studentBoarded(params: {
    parentEmail: string;
    studentName: string;
    busNumber: string;
    telegramChatId?: string | null;
    phone?: string | null;
  }) {
    const msg = `✅ <b>${params.studentName}</b> has boarded bus <b>${params.busNumber}</b>.`;
    if (params.telegramChatId) {
      await telegram(params.telegramChatId, msg);
    }
    if (params.phone) {
      await whatsapp(params.phone, msg.replace(/<[^>]+>/g, ""));
    }
  },

  /**
   * Parent notification: student dropped at destination.
   * Channels: Telegram personal + WhatsApp (future)
   */
  async studentDropped(params: {
    parentEmail: string;
    studentName: string;
    location: string;
    telegramChatId?: string | null;
    phone?: string | null;
  }) {
    const msg = `🏫 <b>${params.studentName}</b> has been dropped at <b>${params.location}</b>.`;
    if (params.telegramChatId) {
      await telegram(params.telegramChatId, msg);
    }
    if (params.phone) {
      await whatsapp(params.phone, msg.replace(/<[^>]+>/g, ""));
    }
  },

  /**
   * Admin/transport alert: bus delayed.
   * Channels: Telegram channel (broadcast) + email to admin
   */
  async busDelayed(params: {
    adminEmail: string;
    busNumber: string;
    delayMinutes: number;
    reason?: string;
    telegramChannelId?: string | null;
  }) {
    const msg = `⚠️ Bus <b>${params.busNumber}</b> is delayed by ${params.delayMinutes} min.${params.reason ? `\nReason: ${params.reason}` : ""}`;
    if (params.telegramChannelId) {
      await telegram(params.telegramChannelId, msg);
    }
    await email(
      params.adminEmail,
      `Bus ${params.busNumber} delayed — ${params.delayMinutes} min`,
      `<p>${msg.replace(/<[^>]+>/g, "")}</p>`,
    );
  },

  /**
   * Admin alert: driver marked absent.
   * Channels: email to admin + Telegram channel
   */
  async driverAbsent(params: {
    adminEmail: string;
    driverName: string;
    routeName: string;
    telegramChannelId?: string | null;
  }) {
    const msg = `🚨 Driver <b>${params.driverName}</b> is absent. Route <b>${params.routeName}</b> needs coverage.`;
    if (params.telegramChannelId) {
      await telegram(params.telegramChannelId, msg);
    }
    await email(
      params.adminEmail,
      `Driver absent — ${params.driverName} (${params.routeName})`,
      `<p>${msg.replace(/<[^>]+>/g, "")}</p>`,
    );
  },
};
