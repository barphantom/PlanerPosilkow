from pydantic import BaseModel
from typing import List


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str | None = None


class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class IngredientCreate(BaseModel):
    name: str
    weight: int


class MealCreate(BaseModel):
    name: str
    ingredients: List[IngredientCreate]


class MealResponse(BaseModel):
    id: int
    name: str
    ingredients: List[IngredientCreate]

    class Config:
        from_attributes = True
