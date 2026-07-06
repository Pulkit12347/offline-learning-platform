from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "mysql+pymysql://user:password@localhost:3306/offline_learning"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
