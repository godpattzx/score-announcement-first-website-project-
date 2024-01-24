import NavigationBar from "./components/navbar"
import { MainComponent as Users } from "./web_page/home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Auth/AuthContext';




function App() {
    return (
        <AuthProvider>
        <div> 
            <NavigationBar/>
            <Users/>
            <ToastContainer />
        </div>
        </AuthProvider>
        
    );
}

export default App;