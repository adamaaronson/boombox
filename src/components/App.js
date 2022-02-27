import React from 'react'
// import {BrowserRouter as Router, Route } from 'react-router-dom'
import LoginPage from './LoginPage';
import GamePage from './GamePage';
import Header from './Header';
import '../css/App.scss'
import Cookies from 'js-cookie'
import Footer from './Footer'
const HOME_URL = 'http://localhost:3000'

export default function App() {
    const [token, setToken] = React.useState(Cookies.get("spotifyAuthToken"))

    return (
        <div className='app'>
            <div className='content'>
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
            <Footer />
        </div>
    )
}
