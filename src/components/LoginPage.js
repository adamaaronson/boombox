import React from 'react'
import Cookies from 'js-cookie'
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

export default function LoginPage(props) {
    return (
        <div>
            <SpotifyAuth
                redirectUri={`${props.homeURL}/callback`}
                clientID='29c1316b4c844ab3b3abb8a9fff67957'
                scopes={[Scopes.userLibraryRead, Scopes.userReadPrivate, Scopes.playlistReadPrivate]} // either style will work
                onAccessToken={(token) => props.setToken(token)}
            />
        </div>
    )
}
