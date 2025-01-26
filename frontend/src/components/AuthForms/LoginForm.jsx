import React, {useState} from "react";
import './AuthForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import api from "../../api.js";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !password) {
            setError("Username and password are required!")
            return false
        }
        setError('')
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await api.post("/login", formData.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            setLoading(false);

            const token = response.data.access_token;
            localStorage.setItem("token", token);
            console.log("Zalogowano");
            navigate("/")

        } catch (error) {
            setLoading(false)
            setError("An error occurred. Please try again.")
            console.log("Błąd logowania", error);
        }
    }


    return (
        <div className="layout">
            <div className="wrapper login">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className="icon"/>
                    </div>
                    <button type="submit">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <div className="register-link">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                    {error && <p style={{color: "red"}}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
