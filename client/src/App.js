import React from "react";
import NavigationBar from "./components/navbar"; 
import { MainComponent as Users } from "./web_page/home"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from './Auth/AuthContext';

function App() {
  return (
    <ContextProvider>
      <div>
        <NavigationBar />
        <Users />
        <ToastContainer />
      </div>
    </ContextProvider>
  );
}

export default App;
