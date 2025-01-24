import React from "react";
import './RegistrationForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";


export default function RegistrationForm() {
    return (
      <div className="wrapper">
          <form action="">
              <h1>Registration</h1>
              <div className="input-box">
                  <input type="text" placeholder="Username" required/>
                  <FaUser className="icon"/>
              </div>
              <div className="input-box">
                  <input type="email" placeholder="email address" required/>
                  <IoMail className="icon"/>
              </div>
              <div className="input-box">
                  <input type="password" placeholder="Password" required/>
                  <FaLock className="icon"/>
              </div>

              <div className="remember-forgot">
                  <label><input type="checkbox" required/>I agree to the terms & conditions</label>
              </div>

              <button type="submit">Login</button>

              <div className="register-link">
                  <p>Already have an account? <a href="#">Log in</a></p>
              </div>
          </form>
      </div>
    );
}
