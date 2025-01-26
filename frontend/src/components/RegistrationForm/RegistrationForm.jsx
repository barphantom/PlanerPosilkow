import React, {useState} from "react";
import './RegistrationForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import api from "../../api.js";
import { Link } from "react-router-dom"


export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/register", formData);
            console.log("Rejestracja przebiegła pomyślnie.", response.data);

        } catch (error) {
            console.log("Błąd w rejestracji", error);
        }

    }

    return (
      <div className="wrapper">
          <form onSubmit={handleSubmit}>
              <h1>Registration</h1>
              <div className="input-box">
                  <input type="text" placeholder="Username" required
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <FaUser className="icon"/>
              </div>
              <div className="input-box">
                  <input type="password" placeholder="Password" required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <FaLock className="icon"/>
              </div>
              <button type="submit">Register</button>
              <div className="register-link">
                  <p>Already have an account? <Link to="/login">Log in</Link></p>
              </div>
          </form>
      </div>
    );
}
