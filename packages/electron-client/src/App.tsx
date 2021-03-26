import { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';

export default function App() {

    const [authenticated, setAuthenticated] = useState(false);
    
    return (
        <BrowserRouter>
            <Route exact path="/" component={Login}/>
            <Route path="/user" component={Main}/>
        </BrowserRouter>
    )
}