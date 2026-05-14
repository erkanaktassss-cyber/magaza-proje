from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FabrikaOS AI API"
    database_url: str = "postgresql+psycopg://factory:factory@db:5432/fabrikaos"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"


settings = Settings()
