import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import AddMeal from "./components/AddMeal/AddMeal.jsx";
import DisplayMeals from "./components/DisplayMeals/DisplayMeals.jsx";
import LoginForm from "./components/AuthForms/LoginForm.jsx";
import RegistrationForm from "./components/AuthForms/RegistrationForm.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginForm />,
        errorElement: <NotFoundPage />
    },
    {
        path: '/',
        element: <App />,
        errorElement: <NotFoundPage />
    },
    {
        path: '/register',
        element: <RegistrationForm />,
        errorElement: <NotFoundPage />
    },
    {
        path: '/library',
        element: <DisplayMeals />,
        errorElement: <NotFoundPage />
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/*<App />*/}
  </StrictMode>,
)
