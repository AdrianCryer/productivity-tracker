import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Link, BrowserRouter, Route, useHistory } from 'react-router-dom';
import { Button, Space } from 'antd';
import Main from './pages/Main';


const TestRoot = () => {
    const history = useHistory();

    return (
        <Space direction="vertical">
            Main Page
            <Button onClick={() => history.push("/user")}>Go to dashboard</Button>
        </Space>
    )
}

export default function App() {

    const [authenticated, setAuthenticated] = useState(false);
    
    return (
        <BrowserRouter>
            <Route exact path="/" component={TestRoot}/>
            <Route exact path="/user" component={Main}/>
        </BrowserRouter>
    )
}