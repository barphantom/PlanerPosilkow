import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "./components/Header.jsx";
import AddMeal from "./components/AddMeal/AddMeal.jsx";
import LogOutButton from "./components/LogOutButton.jsx";
import MealForm from "./components/MealForm.jsx";
import MealList from "./components/MealList.jsx";
import api from "./api.js";
import { useNavigate } from 'react-router-dom';


export default function App() {
    // const [ meals, setMeals ] = useState([])
    const navigate = useNavigate();

    // const fetchMeals = async () => {
    //     try {
    //         const response = await api.get('/meals')
    //         setMeals(response.data.meals)
    //     } catch (error) {
    //         console.error("Error fetching meals", meals)
    //     }
    // }

    // const addMeal = async (meal) => {
    //     try {
    //         await api.post('/meals', meal)
    //         fetchMeals();
    //     } catch (error) {
    //         console.error("Error adding fruit", error)
    //     }
    // }

    // useEffect(() => {
    //     fetchMeals()
    // }, []);

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
        }

        verifyToken();
    }, [navigate]);


    return (
        <>
            <LogOutButton />
            <Header />
            <AddMeal />
            {/*<MealForm addMeal={addMeal}/>*/}
            {/*<MealList meals={meals}/>*/}
        </>
    )
}
