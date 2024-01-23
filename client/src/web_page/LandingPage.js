import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import "./LandingPage.css";
import {Toggle} from '../components/LandingPage/toggle';
import useLocalStorage from "use-local-storage";

export const LandingPage = () => {
    const [isDark, setIsDark] = useLocalStorage("isDark",false);
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="Land" data-theme={isDark ? "dark" : "light"}>
            <Toggle
                isChecked={isDark}
                handleChange={() => setIsDark(!isDark)}
            />
            <hi className="title">Score Announcement</hi>
            <div className="box">
                <h5 onClick={handleLogin}>Login</h5>
                
            </div>
             </div>
    );
};
export default LandingPage;