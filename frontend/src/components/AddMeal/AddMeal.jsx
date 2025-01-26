import React, { useState } from "react";
import "./AddMeal.css"
import api from "../../api.js";


export default function AddMeal() {
const [mealName, setMealName] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", weight: "" }]);

    const handleMealNameChange = (e) => setMealName(e.target.value);

    const handleIngredientChange = (index, event) => {
        const { name, value } = event.target;
        const newIngredients = [...ingredients];
        newIngredients[index][name] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", weight: "" }]);
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // Pobranie tokena
            const response = await api.post(
                "/meals",
                { name: mealName, ingredients },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Posiłek dodany:", response.data);
            setMealName("");
            setIngredients([{ name: "", weight: "" }]); // Resetowanie formularza
        } catch (error) {
            console.error("Błąd dodawania posiłku:", error);
        }
    };

    return (
        <div className="add-meal-container">
            <h2>Dodaj posiłek</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="meal-input"
                    placeholder="Nazwa posiłku"
                    value={mealName}
                    onChange={handleMealNameChange}
                    required
                />
                <h3>Składniki:</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-row">
                        <input
                            type="text"
                            className="ingredient-input"
                            name="name"
                            placeholder="Nazwa składnika"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            className="ingredient-input"
                            name="weight"
                            placeholder="Waga (g)"
                            value={ingredient.weight}
                            onChange={(e) => handleIngredientChange(index, e)}
                            required
                        />
                        {index > 0 && (
                            <button type="button" onClick={() => removeIngredient(index)}>❌</button>
                        )}
                    </div>
                ))}
                <button type="button" className="add-button" onClick={addIngredient}>➕ Dodaj składnik</button>
                <button type="submit" className="submit-button">Zapisz posiłek</button>
            </form>
        </div>
    );
}

