import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm.jsx";


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginForm />,
        errorElement: <NotFoundPage />
    },
    {
        path: '/add-meal',
        element: <App />,
        errorElement: <NotFoundPage />
    },
    {
        path: '/register',
        element: <RegistrationForm />,
        errorElement: <NotFoundPage />
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/*<App />*/}
  </StrictMode>,
)
