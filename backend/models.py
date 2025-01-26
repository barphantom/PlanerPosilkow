from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from database import engine


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    meals = relationship("Meal", back_populates="owner")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="meals")
    ingredients = relationship("Ingredient", back_populates="meal", cascade="all, delete-orphan")


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    weight = Column(Integer, nullable=False)
    meal_id = Column(Integer, ForeignKey("meals.id"))

    meal = relationship("Meal", back_populates="ingredients")


# User.metadata.create_all(bind=engine)
