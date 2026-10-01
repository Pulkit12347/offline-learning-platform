from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "mysql+pymysql://user:password@localhost:3306/offline_learning"
    cors_origins: list[str] = ["http://localhost:5173"]

    # Authentication
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # One-time passcodes (email verification / password reset)
    otp_expire_minutes: int = 10
    otp_max_attempts: int = 5

    # Admin access: the account registered with this email becomes an admin.
    admin_email: str = ""

    # SMTP (Gmail: host smtp.gmail.com, port 587, password = 16-digit app password)
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_from_name: str = "ConceptFlow"

    @property
    def smtp_configured(self) -> bool:
        return bool(self.smtp_username and self.smtp_password)

    @property
    def sender_email(self) -> str:
        return self.smtp_from_email or self.smtp_username


settings = Settings()
