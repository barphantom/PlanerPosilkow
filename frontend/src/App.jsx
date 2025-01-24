import React, {useEffect, useState} from 'react';
import './App.css';
import FruitList from './components/Meals.jsx';
import Header from "./components/Header.jsx";
import MealForm from "./components/MealForm.jsx";
import MealList from "./components/MealList.jsx";
import api from "./api.js";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";


// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Meals Management App</h1>
//       </header>
//       <main>
//         <FruitList />
//       </main>
//     </div>
//   );
// };
//
// export default App;

export default function App() {
    const [ meals, setMeals ] = useState([])

const fetchMeals = async () => {
    try {
        const response = await api.get('/meals')
        setMeals(response.data.meals)
    } catch (error) {
        console.error("Error fetching meals", meals)
    }
}

const addMeal = async (meal) => {
    try {
        await api.post('meals', meal)
        fetchMeals();
    } catch (error) {
        console.error("Error adding fruit", error)
    }
}

useEffect(() => {
    fetchMeals()
}, []);

    return (
        <>
            <Header />
            <MealForm addMeal={addMeal}/>
            <MealList meals={meals}/>
            <LoginForm />
            <RegistrationForm />
        </>
    )
}
