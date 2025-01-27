import React, { useEffect, useState } from "react";
import api from "../../api";
import "./DisplayMeals.css";
import { useNavigate } from "react-router-dom";
import LinkButton from "../LinkButton.jsx";
import LogOutButton from "../LogOutButton.jsx";

export default function DisplayMeals() {
    const [meals, setMeals] = useState([]);
    const navigate = useNavigate();

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
        const fetchMeals = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/meals", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMeals(response.data);
            } catch (error) {
                console.error("Błąd pobierania posiłków:", error);
            }
        };

        fetchMeals();
    }, []);

    const handleDelete = async (mealId) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć ten posiłek?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/meals/${mealId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMeals(meals.filter(meal => meal.id !== mealId));
        } catch (error) {
            console.error("Błąd podczas usuwania posiłku:", error);
        }
    };

    return (
        <div>
            <LogOutButton />
            <div className="meal-list-container">
                <h2>Lista posiłków</h2>
                {meals.length === 0 ? (
                    <p>Brak zapisanych posiłków.</p>
                ) : (
                    <ul>
                        {meals.map((meal) => (
                            <li key={meal.id} className="meal-display-item">
                                <div className="meal-header">
                                    <p className="meal-display-name">{meal.name}</p>
                                </div>
                                <ul className="ingredient-display-list">
                                    {meal.ingredients.map((ingredient, index) => (
                                        <li key={index} className="ingredient-display-item">
                                            {ingredient.name} - {ingredient.weight} g
                                        </li>
                                    ))}
                                </ul>
                                <div className="meal-actions">
                                    <button onClick={() => navigate(`/edit-meal/${meal.id}`)} className="edit-button">Edytuj</button>
                                    <button onClick={() => handleDelete(meal.id)} className="delete-button">Usuń</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <LinkButton dest="/">
                Strona główna
            </LinkButton>
        </div>
    );
}
