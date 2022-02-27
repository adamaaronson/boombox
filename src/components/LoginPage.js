import React from 'react'
import Cookies from 'js-cookie'
import Header from './Header.js'
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import '../css/LoginPage.scss'
import 'react-spotify-auth/dist/index.css'

export default function LoginPage(props) {
    return (
        <div className="login-page">
            <Header/>
            <SpotifyAuth
                redirectUri={`${props.homeURL}/`}
                clientID='29c1316b4c844ab3b3abb8a9fff67957'
                scopes={[Scopes.userLibraryRead, Scopes.userReadPrivate, Scopes.playlistReadPrivate]} // either style will work
                onAccessToken={(token) => props.setToken(token)}
                btnClassName="spotify-button"
                logoClassName="spotify-logo"
                title={"Continue With" + String.fromCharCode(160) + "Spotify"}
            />
        </div>
    )
}
