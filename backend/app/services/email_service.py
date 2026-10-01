import logging
import smtplib
import ssl
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Sends transactional email over SMTP (Gmail-compatible).

    If SMTP is not configured, the code is logged instead of sent so the
    flow remains testable in local development without real credentials.
    """

    def send_otp(self, to_email: str, code: str, purpose: str) -> None:
        if purpose == "reset":
            subject = "Reset your ConceptFlow password"
            intro = "Use the code below to reset your ConceptFlow password."
        else:
            subject = "Verify your ConceptFlow email"
            intro = "Welcome to ConceptFlow! Use the code below to verify your email."

        text_body = (
            f"{intro}\n\n"
            f"Your verification code is: {code}\n\n"
            f"This code expires in {settings.otp_expire_minutes} minutes.\n"
            "If you didn't request this, you can safely ignore this email."
        )
        html_body = self._html_body(intro, code)

        if not settings.smtp_configured:
            logger.warning(
                "SMTP not configured; OTP for %s (%s) is: %s",
                to_email,
                purpose,
                code,
            )
            return

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = f"{settings.smtp_from_name} <{settings.sender_email}>"
        message["To"] = to_email
        message.set_content(text_body)
        message.add_alternative(html_body, subtype="html")

        context = ssl.create_default_context()
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            server.starttls(context=context)
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)

    @staticmethod
    def _html_body(intro: str, code: str) -> str:
        return f"""\
<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;
            padding:32px 24px;color:#0f172a">
  <h1 style="font-size:20px;margin:0 0 16px">ConceptFlow</h1>
  <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 24px">{intro}</p>
  <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;
              background:#f1f5f9;border-radius:12px;padding:20px 0;color:#4f46e5">
    {code}
  </div>
  <p style="font-size:13px;color:#64748b;margin:24px 0 0">
    This code expires in {settings.otp_expire_minutes} minutes. If you didn't request
    it, you can safely ignore this email.
  </p>
</div>"""
