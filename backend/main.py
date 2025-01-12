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
def get_meals():
    return Meals(meals=memory_db["meals"])


@app.post("/meals", response_model=Meal)
def add_meal(meal: Meal):
    memory_db["meals"].append(meal)
    return meal


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
