import React from 'react';
import { Link } from 'react-router-dom';

export default function Info() {
    return (
        <div>
            <h1>Info Page</h1>
            <Link to="/">Go back to home</Link>
        </div>
    );
}
