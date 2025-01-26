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
                  ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme, authenticate_user)

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


# class Meal(BaseModel):
#     mealName: str
#     ingredient: str
#     weight: float
#
#
# class Meals(BaseModel):
#     meals: List[Meal]


# memory_db = {"meals": []}
# fake_db = {
#     "Bartek": {
#         "username": "barti",
#         "full_name": "Bartek Dobrzanski",
#         "email": "bartek@gmail.com",
#         "hashed_password": "",
#         "disabled": False,
#     }
# }


# class Token(BaseModel):
#     access_token: str
#     token_type: str
#
#
# class TokenData(BaseModel):
#     username: str | None = None
#
#
# class User(BaseModel):
#     username: str
#     full_name: str | None = None
#     email: str | None = None
#     disabled: bool | None = False
#
#
# class UserInDB(User):
#     hashed_password: str
#
#
# oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token")
#
#
# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)
#
#
# def get_password_hash(password):
#     return pwd_context.hash(password)
#
#
# def get_user(db, username: str):
#     if username in db:
#         user_data = db[username]
#         return UserInDB(**user_data)
#
#
# def authenticate_user(db, username: str, password: str):
#     user = get_user(db, username)
#     if not user:
#         return False
#     if not verify_password(password, user.hashed_password):
#         return False
#
#     return user
#
#
# def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
#     return encoded_jwt
#
#
# async def get_current_user(token: str = Depends(oauth_2_scheme)):
#     credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
#
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except JWTError:
#         raise credentials_exception
#
#     user = get_user(fake_db, username=token_data.username)
#     if user is None:
#         raise credentials_exception
#
#     return user
#
#
# async def get_current_active_user(
#     current_user: UserInDB = Depends(get_current_user),
# ):
#     if current_user.disabled:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user
#
#
# @app.post("/token", response_model=Token)
# async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
#     user = authenticate_user(fake_db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.username}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}
#
#
# @app.get("/users/me", response_model=User)
# async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
#     return current_user
#
#
# @app.get("/users/me/items")
# async def read_own_items(current_user: User = Depends(get_current_active_user)):
#     return [{"item_id": 1, "owner": current_user}]


# --------------------------------------------------------------------------


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
    )eeqe
    return Token(access_token=access_token, token_type="bearer")


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


# class UserRegister(BaseModel):
#     username: str
#     email: str
#     password: str


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
