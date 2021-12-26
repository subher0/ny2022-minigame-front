import React, {useState} from 'react';
import './App.css';
import LoggedInRoutes from './pages/LoggedInRoutes';
import LoginPage from "./pages/login/LoginPage";

function App() {
    const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem('name') != null)

    let rootComponent;
    if (isAuthenticated) {
        rootComponent = <LoggedInRoutes onExit={() => {
            localStorage.removeItem('name')
            localStorage.removeItem('userId')
            setAuthenticated(false);
        }}/>
    } else {
        rootComponent = <LoginPage onLogin={(name, userId) => {
            localStorage.setItem('name', name)
            localStorage.setItem('userId', userId)
            setAuthenticated(true)
        }}/>
    }

    return (
        <div className="App">
            {rootComponent}
        </div>
    );
}

export default App;
