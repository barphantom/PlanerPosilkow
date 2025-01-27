import React from "react";
import { useNavigate } from "react-router-dom";

export default function LinkButton({ dest, children }) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            style={{
                borderRadius: "25px",
                backgroundColor: "rgba(223,183,125,0.97)",
                color: "#000",
                padding: "15px 32px",
                border: "none",
                cursor: "pointer",
                fontStyle: "16px",
                boxShadow: "0 2px 5px rgba(0, 0, 255, .2)",
                transition: "all .5s ease",
            }}
            className="main-page-btn"
            onClick={() => navigate(`${dest}`)}>
                {children}
        </button>
    );
}
