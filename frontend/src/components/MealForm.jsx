import React from "react";
import {useState} from "react";

export default function MealForm() {
    const [formData, setFormData] = useState({
        mealName: "",
        ingredient: "",
        weight: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div id="meal-inputs">
            <form onSubmit={handleSubmit}>
                <div className="controls">
                    <p>
                        <label>Name</label>
                        <input type="text" name="mealName" value={formData.mealName} onChange={handleChange}/>
                    </p>
                    <p>
                        <label>Ingredients</label>
                        <input type="text" name="ingredient" value={formData.ingredient} onChange={handleChange}/>
                    </p>
                    <p>
                        <label>Weight</label>
                        <input type="text" name="weight" value={formData.weight} onChange={handleChange}/>
                    </p>
                </div>
                <button type="submit">Add Meal</button>
            </form>
        </div>
    )
}