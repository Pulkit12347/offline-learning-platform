from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.repositories.otp_repository import OtpRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResendOtpRequest,
    ResetPasswordRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.services.email_service import EmailService

router = APIRouter()


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db), OtpRepository(db), EmailService())


@router.post(
    "/register",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    auth_service.register(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        grade=payload.grade,
    )
    return MessageResponse(
        message="Registration successful. Check your email for a verification code."
    )


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(
    payload: VerifyEmailRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    auth_service.verify_email(email=payload.email, code=payload.code)
    return MessageResponse(message="Email verified. You can now sign in.")


@router.post("/resend-otp", response_model=MessageResponse)
def resend_otp(
    payload: ResendOtpRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    auth_service.resend_signup_otp(email=payload.email)
    return MessageResponse(
        message="If an unverified account exists, a new code has been sent."
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    token, user = auth_service.login(email=payload.email, password=payload.password)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    auth_service.forgot_password(email=payload.email)
    return MessageResponse(
        message="If an account exists for this email, a reset code has been sent."
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    payload: ResetPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    auth_service.reset_password(
        email=payload.email,
        code=payload.code,
        new_password=payload.new_password,
    )
    return MessageResponse(message="Password updated. You can now sign in.")


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
