import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export interface EmailSendOptions {
  to: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  identifierCode: string;
  courseTitle?: string;
  cohort?: string;
  activationCode: string;
  activationToken: string;
  appUrl?: string;
}

export interface EmailStatusResult {
  isConfigured: boolean;
  provider: 'gmail_smtp' | 'resend' | 'custom_smtp' | 'preview_mode';
  fromEmail: string;
  message: string;
}

/**
 * Returns active provider details
 */
export function getEmailProviderStatus(): EmailStatusResult {
  const rawResendKey = process.env.RESEND_API_KEY;
  const resendKey = rawResendKey ? rawResendKey.trim().replace(/^['"]+|['"]+$/g, '') : undefined;
  const gmailUser = (process.env.GMAIL_USER || (process.env.SMTP_USER && process.env.SMTP_USER.includes('@gmail.com') ? process.env.SMTP_USER : 'ayodeleflow19@gmail.com')).trim().replace(/^['"]+|['"]+$/g, '');
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS || '').trim().replace(/\s+/g, '');
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (resendKey && resendKey.length > 5) {
    const masked = resendKey.length > 10 ? `${resendKey.substring(0, 5)}...${resendKey.substring(resendKey.length - 4)}` : 'Active';
    const fromEmail = (process.env.SMTP_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev').trim();
    return {
      isConfigured: true,
      provider: 'resend',
      fromEmail,
      message: `Resend API Key configured [${masked}] (3,000 free emails/month via ${fromEmail})`,
    };
  }

  if (gmailPass && gmailPass.length >= 8) {
    return {
      isConfigured: true,
      provider: 'gmail_smtp',
      fromEmail: gmailUser,
      message: `Free Gmail SMTP configured for ${gmailUser} (up to 500 emails/day)`,
    };
  }

  if (smtpHost && smtpUser && smtpPass) {
    return {
      isConfigured: true,
      provider: 'custom_smtp',
      fromEmail: process.env.SMTP_FROM_EMAIL || smtpUser,
      message: `Custom SMTP configured on ${smtpHost}`,
    };
  }

  return {
    isConfigured: false,
    provider: 'preview_mode',
    fromEmail: 'noreply@ojismedia.academy',
    message: 'No live SMTP configured yet. Activation tokens are generated & instant preview links provided.',
  };
}

export interface SentEmailRecord {
  id: string;
  to: string;
  from: string;
  subject: string;
  html: string;
  activationCode: string;
  activationUrl: string;
  activationToken: string;
  provider: string;
  sentAt: string;
  etherealUrl?: string;
  read: boolean;
}

// In-memory Sent Emails Log
const sentEmailsHistory: SentEmailRecord[] = [];

export function getSentEmails(filterEmail?: string): SentEmailRecord[] {
  if (!filterEmail) {
    return [...sentEmailsHistory].reverse();
  }
  const clean = filterEmail.toLowerCase().trim();
  return sentEmailsHistory.filter((e) => e.to.toLowerCase() === clean).reverse();
}

export function getLatestSentEmail(filterEmail?: string): SentEmailRecord | null {
  const list = getSentEmails(filterEmail);
  return list.length > 0 ? list[0] : null;
}

/**
 * Generates branded HTML for the activation email
 */
function buildActivationEmailHtml(params: {
  name: string;
  role: string;
  identifierCode: string;
  courseTitle?: string;
  cohort?: string;
  activationCode: string;
  activationUrl: string;
}): string {
  const { name, role, identifierCode, courseTitle, cohort, activationCode, activationUrl } = params;
  const roleLabel = role === 'student' ? 'Student' : role === 'instructor' ? 'Faculty Instructor' : 'Staff Member';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activate Your OJIS Media Academy Account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b132b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #0b132b;
      padding: 32px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #091224 0%, #1e3a8a 50%, #2563eb 100%);
      padding: 36px 32px;
      text-align: center;
      color: #ffffff;
    }
    .logo-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 12px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #facc15;
      margin-bottom: 12px;
    }
    .header-title {
      font-size: 26px;
      font-weight: 800;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      font-size: 15px;
      color: #cbd5e1;
      margin: 0;
    }
    .body-content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .text {
      font-size: 15px;
      color: #334155;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .credentials-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .cred-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 14px;
    }
    .cred-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .cred-label {
      font-weight: 600;
      color: #64748b;
    }
    .cred-val {
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }
    .code-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 2px dashed #10b981;
      border-radius: 14px;
      padding: 24px 16px;
      text-align: center;
      margin: 24px 0;
    }
    .code-label {
      font-size: 11px;
      font-weight: 700;
      color: #065f46;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .code-digits {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 10px;
      color: #047857;
      font-family: 'Courier New', Courier, monospace;
      margin: 4px 0;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 20px 0;
    }
    .activate-btn {
      display: inline-block;
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 16px 36px;
      border-radius: 12px;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.35);
      letter-spacing: 0.3px;
    }
    .alt-link-box {
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 12px;
      font-size: 12px;
      color: #475569;
      word-break: break-all;
      margin-bottom: 24px;
    }
    .footer {
      background-color: #0f172a;
      padding: 28px 32px;
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
    }
    .footer a {
      color: #38bdf8;
      text-decoration: none;
    }
    .security-notice {
      font-size: 12px;
      color: #64748b;
      margin-top: 20px;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-badge">OJIS MEDIA ACADEMY</div>
        <h1 class="header-title">Account Activation</h1>
        <p class="header-subtitle">Welcome to Nigeria's Premier Hands-On Creative Media Campus</p>
      </div>

      <div class="body-content">
        <h2 class="greeting">Hello, ${name}!</h2>
        <p class="text">
          Congratulations on taking your step into creative excellence. Your official ${roleLabel} account has been created on the <strong>OJIS Media Academy Portal</strong>.
        </p>

        <div class="credentials-card">
          <div class="cred-row">
            <span class="cred-label">Official Identification:</span>
            <span class="cred-val" style="color: #2563eb;">${identifierCode}</span>
          </div>
          <div class="cred-row">
            <span class="cred-label">Account Role:</span>
            <span class="cred-val">${roleLabel}</span>
          </div>
          ${courseTitle ? `
          <div class="cred-row">
            <span class="cred-label">Academic Track:</span>
            <span class="cred-val">${courseTitle}</span>
          </div>` : ''}
          ${cohort ? `
          <div class="cred-row">
            <span class="cred-label">Cohort:</span>
            <span class="cred-val">${cohort}</span>
          </div>` : ''}
          <div class="cred-row">
            <span class="cred-label">Verification Status:</span>
            <span class="cred-val" style="color: #ea580c;">Action Required (Activation Code)</span>
          </div>
        </div>

        <!-- 6-DIGIT ACTIVATION CODE HIGHLIGHT -->
        <div class="code-box">
          <div class="code-label">YOUR 6-DIGIT ACTIVATION CODE</div>
          <div class="code-digits">${activationCode}</div>
          <div style="font-size: 12px; color: #065f46; font-weight: 500;">
            Enter this 6-digit code on the academy login screen to unlock your dashboard.
          </div>
        </div>

        <p class="text" style="margin-bottom: 12px; text-align: center;">
          You can also activate your account with a single click:
        </p>

        <div class="btn-container">
          <a href="${activationUrl}" target="_blank" class="activate-btn">
            Activate My Academy Account &rarr;
          </a>
        </div>

        <p class="text" style="font-size: 13px; color: #64748b; margin-bottom: 6px;">
          Direct verification link:
        </p>
        <div class="alt-link-box">
          <a href="${activationUrl}" style="color: #2563eb; text-decoration: underline;">${activationUrl}</a>
        </div>

        <div class="security-notice">
          <strong>Security Notice:</strong> This activation code will expire in 24 hours. If you did not create an account with OJIS Media Academy, please disregard this email.
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #f8fafc;">OJIS Media Academy & Studios</p>
        <p style="margin: 0 0 12px 0;">12 Allen Avenue, Ikeja, Lagos, Nigeria | <a href="mailto:admissions@ojismedia.academy">admissions@ojismedia.academy</a></p>
        <p style="margin: 0; font-size: 11px; color: #64748b;">
          &copy; ${new Date().getFullYear()} OJIS Media Academy. All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Sends activation email using configured free service (Gmail SMTP / Resend / Custom SMTP)
 */
export async function sendActivationEmail(options: EmailSendOptions): Promise<{
  success: boolean;
  provider: string;
  activationUrl: string;
  activationCode: string;
  messageId?: string;
  error?: string;
}> {
  const { to, name, role, identifierCode, courseTitle, cohort, activationCode, activationToken } = options;

  // Derive target app base URL
  const baseUrl = options.appUrl || process.env.APP_URL || 'http://localhost:3000';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const activationUrl = `${cleanBaseUrl}/activate?token=${encodeURIComponent(activationToken)}&code=${encodeURIComponent(activationCode)}&email=${encodeURIComponent(to)}`;

  const emailHtml = buildActivationEmailHtml({
    name,
    role,
    identifierCode,
    courseTitle,
    cohort,
    activationCode,
    activationUrl,
  });

  const subject = `Your OJIS Media Academy Activation Code: [${activationCode}] - ${identifierCode}`;

  const status = getEmailProviderStatus();
  console.log(`[Email Service] Preparing activation email for ${to} via ${status.provider}... (Code: ${activationCode})`);

  // ==========================================
  // 1. FREE GMAIL SMTP (Nodemailer)
  // ==========================================
  if (status.provider === 'gmail_smtp') {
    try {
      const user = process.env.GMAIL_USER || process.env.SMTP_USER || 'ayodeleflow19@gmail.com';
      const pass = (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, '');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"OJIS Media Academy" <${user}>`,
        to,
        subject,
        html: emailHtml,
      });

      console.log(`[Email Service] Successfully sent live Gmail activation email to ${to}! MessageId: ${info.messageId}`);
      
      const record: SentEmailRecord = {
        id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to,
        from: user,
        subject,
        html: emailHtml,
        activationCode,
        activationUrl,
        activationToken,
        provider: 'gmail_smtp',
        sentAt: new Date().toISOString(),
        read: false,
      };
      sentEmailsHistory.push(record);

      return {
        success: true,
        provider: 'gmail_smtp',
        activationUrl,
        activationCode,
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error('[Email Service] Gmail SMTP Error:', err);
      return {
        success: false,
        provider: 'gmail_smtp',
        activationUrl,
        activationCode,
        error: `Gmail SMTP dispatch failed: ${err?.message || 'Check App Password'}`,
      };
    }
  }

  // ==========================================
  // 2. FREE RESEND API
  // ==========================================
  if (status.provider === 'resend') {
    try {
      const cleanKey = (process.env.RESEND_API_KEY || '').trim().replace(/^['"]+|['"]+$/g, '');
      const resend = new Resend(cleanKey);
      const fromEmail = (process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || 'onboarding@resend.dev').trim();

      const res = await resend.emails.send({
        from: `OJIS Media Academy <${fromEmail}>`,
        to: [to],
        subject,
        html: emailHtml,
      });

      if (res.error) {
        console.error('[Email Service] Resend API Error:', res.error);
        return {
          success: false,
          provider: 'resend',
          activationUrl,
          activationCode,
          error: res.error.message,
        };
      }

      console.log(`[Email Service] Successfully sent via Resend API to ${to}! ID: ${res.data?.id}`);
      
      const record: SentEmailRecord = {
        id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to,
        from: fromEmail,
        subject,
        html: emailHtml,
        activationCode,
        activationUrl,
        activationToken,
        provider: 'resend',
        sentAt: new Date().toISOString(),
        read: false,
      };
      sentEmailsHistory.push(record);

      return {
        success: true,
        provider: 'resend',
        activationUrl,
        activationCode,
        messageId: res.data?.id,
      };
    } catch (err: any) {
      console.error('[Email Service] Resend Error:', err);
      return {
        success: false,
        provider: 'resend',
        activationUrl,
        activationCode,
        error: err?.message,
      };
    }
  }

  // ==========================================
  // 3. CUSTOM SMTP
  // ==========================================
  if (status.provider === 'custom_smtp') {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
      const info = await transporter.sendMail({
        from: `"OJIS Media Academy" <${fromEmail}>`,
        to,
        subject,
        html: emailHtml,
      });

      console.log(`[Email Service] Successfully sent via Custom SMTP to ${to}! MessageId: ${info.messageId}`);
      
      const record: SentEmailRecord = {
        id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to,
        from: fromEmail || 'smtp@ojismedia.academy',
        subject,
        html: emailHtml,
        activationCode,
        activationUrl,
        activationToken,
        provider: 'custom_smtp',
        sentAt: new Date().toISOString(),
        read: false,
      };
      sentEmailsHistory.push(record);

      return {
        success: true,
        provider: 'custom_smtp',
        activationUrl,
        activationCode,
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error('[Email Service] Custom SMTP Error:', err);
      return {
        success: false,
        provider: 'custom_smtp',
        activationUrl,
        activationCode,
        error: err?.message,
      };
    }
  }

  // ==========================================
  // 4. PREVIEW / SIMULATOR / ETHEREAL MODE
  // ==========================================
  let etherealUrl: string | undefined = undefined;
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: '"OJIS Media Academy" <admissions@ojismedia.academy>',
      to,
      subject,
      html: emailHtml,
    });

    const previewLink = nodemailer.getTestMessageUrl(info);
    if (previewLink) {
      etherealUrl = previewLink.toString();
      console.log(`[Email Service] Live Ethereal Webmail created: ${etherealUrl}`);
    }
  } catch (err) {
    console.log('[Email Service] Ethereal test account generation bypassed, using in-app Webmail store.');
  }

  const record: SentEmailRecord = {
    id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to,
    from: 'admissions@ojismedia.academy',
    subject,
    html: emailHtml,
    activationCode,
    activationUrl,
    activationToken,
    provider: etherealUrl ? 'ethereal_webmail' : 'academy_webmail',
    sentAt: new Date().toISOString(),
    etherealUrl,
    read: false,
  };
  sentEmailsHistory.push(record);

  console.log(`[Email Service - Webmail Dispatch] Delivered activation email to ${to}: Code [${activationCode}], Link: ${activationUrl}`);
  return {
    success: true,
    provider: etherealUrl ? 'ethereal_webmail' : 'academy_webmail',
    activationUrl,
    activationCode,
    messageId: record.id,
  };
}

/**
 * Sends a test email to verify credentials
 */
export async function sendTestEmail(targetEmail: string): Promise<{ success: boolean; message: string; error?: string }> {
  const testToken = `test_tok_${Math.random().toString(36).substring(2, 12)}`;
  const res = await sendActivationEmail({
    to: targetEmail,
    name: 'Academy Administrator',
    role: 'admin',
    identifierCode: 'OJIS-TEST-2026',
    courseTitle: 'System Verification & Diagnostics',
    activationCode: '882026',
    activationToken: testToken,
  });

  if (res.success) {
    return {
      success: true,
      message: `Test email successfully dispatched to ${targetEmail} via ${res.provider}!`,
    };
  } else {
    return {
      success: false,
      message: `Failed to dispatch test email to ${targetEmail}.`,
      error: res.error,
    };
  }
}
