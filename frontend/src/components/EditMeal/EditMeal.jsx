import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "./EditMeal.css";

export default function EditMeal() {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState({ name: "", ingredients: [{ name: "", weight: "" }] });
    const [error, setError] = useState("");

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:8000/verify-token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error("Token verification failed.");
                }
            } catch (error) {
                localStorage.removeItem("token")
                navigate("/login")
            }
        };

        verifyToken();
    }, [navigate]);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get(`/meals/${mealId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMeal(response.data);
            } catch (error) {
                console.error("Błąd pobierania posiłku:", error);
            }
        };
        fetchMeal();
    }, [mealId]);

    const verifyForm = () => {
        if (!meal.name.trim()) {
            setError("Podaj nazwę posiłku.");
            return false;
        }
        if (meal.ingredients.length === 0) {
            setError("Dodaj przynajmniej jeden składnik.");
            return false;
        }
        for (const ingredient of meal.ingredients) {
            if (!ingredient.name.trim() || !String(ingredient.weight).trim()) {
                setError("Każdy składnik musi mieć nazwę i wagę.");
                return false;
            }
        }
        setError("");
        return true;
    };

    const handleChange = (e) => {
        setMeal({ ...meal, name: e.target.value });
        setError("")
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...meal.ingredients];
        updatedIngredients[index][field] = value;
        setMeal({ ...meal, ingredients: updatedIngredients });
        setError("")
    };

    const addIngredient = () => {
        setMeal({ ...meal, ingredients: [...meal.ingredients, { name: "", weight: "" }] });
        setError("")
    };

    const removeIngredient = (index) => {
        const updatedIngredients = meal.ingredients.filter((_, i) => i !== index);
        setMeal({ ...meal, ingredients: updatedIngredients });
        setError("")
    };

    const handleSave = async () => {
        if (!verifyForm()) return;

        try {
            const token = localStorage.getItem("token");
            await api.put(`/meals/${mealId}`, meal, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/library");
        } catch (error) {
            console.error("Błąd zapisywania posiłku:", error);
        }
    };

    return (
        <>
            <div className="edit-meal-container">
                <h2>Edytuj posiłek</h2>
                <input
                    type="text"
                    value={meal.name}
                    onChange={handleChange}
                    className="meal-name-input-ed"
                    placeholder="Nazwa posiłku"
                />
                <h3>Składniki</h3>
                {meal.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-row-ed">
                        <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                            placeholder="Nazwa składnika"
                        />
                        <input
                            type="number"
                            value={ingredient.weight}
                            onChange={(e) => handleIngredientChange(index, "weight", e.target.value)}
                            placeholder="Waga (g)"
                        />
                        <button onClick={() => removeIngredient(index)} className="remove-button-ed">Usuń</button>
                    </div>
                ))}
                <button onClick={addIngredient} className="add-ingredient-button-ed">Dodaj składnik</button>
                <button onClick={handleSave} className="save-button-ed">Zapisz zmiany</button>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
        </>
    );
}
