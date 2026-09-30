import secrets
from datetime import datetime, timedelta, timezone

from app.config import settings
from app.core.exceptions import (
    ConflictError,
    UnauthorizedError,
    ValidationError,
)
from app.core.security import (
    create_access_token,
    hash_code,
    hash_password,
    verify_code,
    verify_password,
)
from app.models.email_otp import EmailOtp
from app.models.user import User
from app.repositories.otp_repository import OtpRepository
from app.repositories.user_repository import UserRepository
from app.services.email_service import EmailService

SIGNUP = "signup"
RESET = "reset"


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _generate_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _as_utc(value: datetime) -> datetime:
    # Values loaded from MySQL are naive; treat them as UTC for comparison.
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        otp_repository: OtpRepository,
        email_service: EmailService,
    ) -> None:
        self.users = user_repository
        self.otps = otp_repository
        self.email = email_service

    # --- Registration & email verification -------------------------------

    def register(self, name: str, email: str, password: str, grade: str | None) -> None:
        email = _normalize_email(email)
        existing = self.users.get_by_email(email)

        if existing and existing.is_verified:
            raise ConflictError("An account with this email already exists.")

        if existing:
            # Re-registering an unverified account: refresh its details.
            existing.name = name.strip()
            existing.password_hash = hash_password(password)
            existing.grade = grade
            existing.is_admin = self._is_admin_email(email)
            self.users.save(existing)
        else:
            user = User(
                name=name.strip(),
                email=email,
                password_hash=hash_password(password),
                grade=grade,
                is_admin=self._is_admin_email(email),
                is_verified=False,
            )
            self.users.create(user)

        self._issue_otp(email, SIGNUP)

    def verify_email(self, email: str, code: str) -> None:
        email = _normalize_email(email)
        user = self.users.get_by_email(email)
        if user is None:
            raise ValidationError("No account found for this email.")
        if user.is_verified:
            return

        self._consume_otp(email, SIGNUP, code)
        user.is_verified = True
        self.users.save(user)

    def resend_signup_otp(self, email: str) -> None:
        email = _normalize_email(email)
        user = self.users.get_by_email(email)
        if user is None or user.is_verified:
            # Don't reveal whether the account exists / is already verified.
            return
        self._issue_otp(email, SIGNUP)

    # --- Login -----------------------------------------------------------

    def login(self, email: str, password: str) -> tuple[str, User]:
        email = _normalize_email(email)
        user = self.users.get_by_email(email)
        if user is None or not verify_password(password, user.password_hash):
            raise UnauthorizedError("Invalid email or password.")
        if not user.is_verified:
            raise UnauthorizedError(
                "Please verify your email before signing in."
            )
        token = create_access_token(str(user.id), {"admin": user.is_admin})
        return token, user

    # --- Password reset --------------------------------------------------

    def forgot_password(self, email: str) -> None:
        email = _normalize_email(email)
        user = self.users.get_by_email(email)
        if user is not None:
            self._issue_otp(email, RESET)
        # Always succeed silently to avoid account enumeration.

    def reset_password(self, email: str, code: str, new_password: str) -> None:
        email = _normalize_email(email)
        user = self.users.get_by_email(email)
        if user is None:
            raise ValidationError("Invalid or expired reset code.")

        self._consume_otp(email, RESET, code)
        user.password_hash = hash_password(new_password)
        # A successful reset also confirms ownership of the email address.
        user.is_verified = True
        self.users.save(user)

    # --- Internals -------------------------------------------------------

    def _is_admin_email(self, email: str) -> bool:
        admin = settings.admin_email.strip().lower()
        return bool(admin) and email == admin

    def _issue_otp(self, email: str, purpose: str) -> None:
        code = _generate_code()
        self.otps.invalidate_existing(email, purpose)
        otp = EmailOtp(
            email=email,
            purpose=purpose,
            code_hash=hash_code(code),
            expires_at=_now() + timedelta(minutes=settings.otp_expire_minutes),
        )
        self.otps.create(otp)
        self.email.send_otp(email, code, purpose)

    def _consume_otp(self, email: str, purpose: str, code: str) -> None:
        otp = self.otps.get_active(email, purpose)
        if otp is None:
            raise ValidationError("Invalid or expired code.")
        if _as_utc(otp.expires_at) < _now():
            raise ValidationError("This code has expired. Please request a new one.")
        if otp.attempts >= settings.otp_max_attempts:
            raise ValidationError("Too many attempts. Please request a new code.")

        if not verify_code(code, otp.code_hash):
            otp.attempts += 1
            self.otps.save(otp)
            raise ValidationError("Incorrect code. Please try again.")

        otp.consumed = True
        self.otps.save(otp)
