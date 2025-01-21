import React from "react";

export default function MealList({ meals }) {
    return (
        <div>
          <h1>Lista posiłków</h1>
          {meals.length === 0 ? (
            <p>Brak zapisanych posiłków.</p>
          ) : (
            <ul>
              {meals.map((meal, index) => (
                <li key={index}>{meal.mealName} with {meal.ingredient} at {meal.weight}
                  {/*<h2>{meal.mealName}</h2>*/}
                  {/*<ul>*/}
                  {/*  {meal.ingredients.map((ingredient, index) => (*/}
                  {/*    <li key={index}>*/}
                  {/*      {ingredient.name} - {ingredient.weight}g*/}
                  {/*    </li>*/}
                  {/*  ))}*/}
                  {/*</ul>*/}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}
