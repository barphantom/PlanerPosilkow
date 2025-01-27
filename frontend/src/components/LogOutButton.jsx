import { useNavigate } from "react-router-dom";
import React from "react";


export default function LogOutButton() {
    const navigate = useNavigate();

    function handleClick() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <button
            type="button"
            className="logout-btn"
            onClick={handleClick}>
                Wyloguj się
        </button>
    );
}