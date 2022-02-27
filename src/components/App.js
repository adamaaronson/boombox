import React from 'react'
// import {BrowserRouter as Router, Route } from 'react-router-dom'
import LoginPage from './LoginPage';
import GamePage from './GamePage';

import Cookies from 'js-cookie'

const HOME_URL = 'http://localhost:3000'

export default function App() {
    const [token, setToken] = React.useState(Cookies.get("spotifyAuthToken"))

    return (
        <div className='app'>
            <h1>🎶 boomBOX. 🎶</h1>
            <h2>ye olde musical guessing game</h2>
            {token ? (
                // Successfully logged in, this will be the app
                <GamePage
                    token={token}
                />
            ) : (
                // Display the login page
                <LoginPage
                    homeURL={HOME_URL}
                    setToken={setToken}
                />
            )}
        </div>
    )
}
