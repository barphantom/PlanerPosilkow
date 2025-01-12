import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


app = FastAPI()

origins = [
    "http://localhost:3000", # tu ma być host aplikacji react
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Meal(BaseModel):
    name: str


class Meals(BaseModel):
    meals: List[Meal]


memory_db = {"meals": []}


@app.get("/meals", response_model=Meals)
async def get_meals():
    return Meals(meals=memory_db["meals"])
