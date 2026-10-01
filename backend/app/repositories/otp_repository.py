from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.email_otp import EmailOtp


class OtpRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_active(self, email: str, purpose: str) -> EmailOtp | None:
        """Most recent unconsumed OTP for an email/purpose."""
        statement = (
            select(EmailOtp)
            .where(
                EmailOtp.email == email.strip().lower(),
                EmailOtp.purpose == purpose,
                EmailOtp.consumed.is_(False),
            )
            .order_by(EmailOtp.created_at.desc())
        )
        return self.db.scalars(statement).first()

    def invalidate_existing(self, email: str, purpose: str) -> None:
        """Drop any prior codes so only the newest one is valid."""
        statement = delete(EmailOtp).where(
            EmailOtp.email == email.strip().lower(),
            EmailOtp.purpose == purpose,
        )
        self.db.execute(statement)
        self.db.commit()

    def create(self, otp: EmailOtp) -> EmailOtp:
        self.db.add(otp)
        self.db.commit()
        self.db.refresh(otp)
        return otp

    def save(self, otp: EmailOtp) -> EmailOtp:
        self.db.add(otp)
        self.db.commit()
        self.db.refresh(otp)
        return otp
