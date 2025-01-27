import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Annotated
from datetime import timedelta, datetime, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext

# -------- Baza danych --------------
from database import engine, Base, SessionLocal
from models import User, Meal, Ingredient
from sqlalchemy.orm import Session

# -------- Schematy pydantic --------------
from schemas import UserCreate, UserResponse, MealCreate, MealResponse, Token

# -------- Autoryzacja --------------
from auth import (hash_password, verify_password, create_access_token, get_current_user,
                  ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme, authenticate_user, verify_token)

# Tworzymy tabele, jeśli ich nie ma
Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://localhost:5173",  # tu ma być host aplikacji react
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    # db_user = db.query(User).filter(User.username == form_data.username).first()
    # if not db_user or not verify_password(user.password, db_user.hashed_password):
    #     raise HTTPException(status_code=400, detail="Invalid credentials")
    # access_token = create_access_token(data={"sub": db_user.id}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    #
    # return {"access_token": access_token, "token_type": "bearer"}
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/verify-token")
def verify_token_endpoint(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    user = verify_token(token, db)
    return {"message": "Token is valid", "user_id": user.id}


@app.post("/meals")
def create_meal(meal: MealCreate, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    db_meal = Meal(name=meal.name, user_id=current_user.id)
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)

    for ingredient in meal.ingredients:
        new_ingredient = Ingredient(name=ingredient.name, weight=ingredient.weight, meal_id=db_meal.id)
        db.add(new_ingredient)

    db.commit()
    db.refresh(db_meal)

    return db_meal


@app.get("/meals", response_model=List[MealResponse])
def get_meals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Meal).filter(Meal.user_id == current_user.id).all()


@app.get("/meals/{meal_id}", response_model=MealResponse)
def get_meal(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


@app.put("/meals/{meal_id}", response_model=MealResponse)
def update_meal(meal_id: int, updated_meal: MealCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    print(meal.user_id)
    print(meal.name)
    print(meal.ingredients)
    print(updated_meal.name)
    print(updated_meal.ingredients)

    meal.name = updated_meal.name
    meal.ingredients.clear()
    meal.ingredients.extend([Ingredient(name=m.name, weight=m.weight) for m in updated_meal.ingredients])

    db.commit()
    db.refresh(meal)
    return meal


@app.delete("/meals/{meal_id}")
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
