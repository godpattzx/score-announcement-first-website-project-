import NavigationBar from "./components/navbar"
import { MainComponent as Users } from "./home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {
    return (
        <div>
            
            <NavigationBar/>
            <Users/>
            <ToastContainer />
        </div>
        
    );
}

export default App;