const nodemailer = require('nodemailer');
const logger = require('./logger');

const BRAND = 'KB Cloud Technologies';
let transporter;

const smtpConfigured = () => !!(process.env.SMTP_USER && process.env.SMTP_PASS);

function getTransporter() {
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

/** For tests: inject a transport (e.g. nodemailer.createTransport({ jsonTransport: true })). */
function setTransporter(t) { transporter = t; }

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function layout(title, bodyHtml) {
  return `<!doctype html><html><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;padding:32px">
<tr><td style="font-size:20px;font-weight:bold;color:#2563eb">${BRAND}</td></tr>
<tr><td style="padding-top:16px;font-size:18px;font-weight:bold">${esc(title)}</td></tr>
<tr><td style="padding-top:12px;font-size:14px;line-height:1.6">${bodyHtml}</td></tr>
<tr><td style="padding-top:24px;font-size:12px;color:#7b8794">&copy; ${BRAND}</td></tr>
</table></td></tr></table></body></html>`;
}

async function send({ to, subject, text, html }) {
  return getTransporter().sendMail({
    from: process.env.MAIL_FROM || `${BRAND} <${process.env.SMTP_USER}>`,
    to, subject, text, html
  });
}

/**
 * Sends the reset email. Without SMTP credentials: logs the link in development only.
 * @returns {Promise<boolean>} true if actually emailed
 */
async function sendPasswordResetEmail(to, resetUrl, expiresMinutes = 30) {
  if (!smtpConfigured() && !transporter) {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn(`SMTP not configured; dev-only reset link for ${to}: ${resetUrl}`);
    } else {
      logger.error('SMTP not configured; password reset email not sent');
    }
    return false;
  }
  const subject = `Reset your ${BRAND} password`;
  const text = `We received a request to reset your ${BRAND} password.\n\nReset it here (valid for ${expiresMinutes} minutes):\n${resetUrl}\n\nIf you did not request this, you can ignore this email; your password will not change.`;
  const html = layout('Reset your password', `<p>We received a request to reset your ${BRAND} password.</p>
<p><a href="${esc(resetUrl)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px">Reset password</a></p>
<p>This link expires in ${expiresMinutes} minutes and can be used once.</p>
<p style="word-break:break-all;font-size:12px;color:#52606d">Or paste this link: ${esc(resetUrl)}</p>
<p>If you did not request this, you can safely ignore this email.</p>`);
  await send({ to, subject, text, html });
  return true;
}

async function sendPasswordChangedEmail(to) {
  if (!smtpConfigured() && !transporter) return false;
  const subject = `Your ${BRAND} password was changed`;
  const text = `Your ${BRAND} password was just changed. If this was not you, reset your password immediately and contact support.`;
  const html = layout('Password changed', `<p>Your ${BRAND} password was just changed.</p><p>If this was not you, reset your password immediately and contact support.</p>`);
  await send({ to, subject, text, html });
  return true;
}

module.exports = { sendPasswordResetEmail, sendPasswordChangedEmail, setTransporter, smtpConfigured };
