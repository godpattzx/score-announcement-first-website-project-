import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";

import "./LandingPage.css";
import {Toggle} from './components/toggle';

export const LandingPage = () => {
    const [isDark, setIsDark] = useState(true)
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
            <hi className="title">Manegement Score</hi>
            <div className="box">
                <h2 onClick={handleLogin}>Login</h2>
                
            </div>
             </div>
    );
};
export default LandingPage;