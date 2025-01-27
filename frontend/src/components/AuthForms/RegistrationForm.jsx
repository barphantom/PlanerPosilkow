import React, {useState} from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import api from "../../api.js";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";


export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const validateForm = () => {
        if (!formData.username || !formData.password) {
            setError("Username and password are required!")
            return false
        }
        setError('')
        return true
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await api.post("/register", formData);
            setLoading(false)
            console.log("Rejestracja przebiegła pomyślnie.", response.data);
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("Nazwa użytkownika już istnieje!");
            } else {
                setError("Wystąpił błąd. Spróbuj ponownie.");
            }
            console.log("Błąd w rejestracji", error);
            setLoading(false)
        }
    }

    return (
        <div className="layout">
            <div className="wrapper register">
              <form onSubmit={handleSubmit}>
                  <h1>Registration</h1>
                  <div className="input-box">
                      <input type="text" name="username" placeholder="Username" required
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <FaUser className="icon"/>
                  </div>
                  <div className="input-box">
                      <input type="password" name="password" placeholder="Password" required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <FaLock className="icon"/>
                  </div>
                  <button type="submit">
                      {loading ? "Registration in progress..." : "Register"}
                  </button>
                  <div className="register-link">
                      <p>Already have an account? <Link to="/login">Log in</Link></p>
                  </div>
                  {error ? <p style={{color: "red"}}>{error}</p> : ""}
              </form>
            </div>
        </div>
    );
}
