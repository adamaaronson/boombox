import React from 'react'
import { SpotifyApiContext } from 'react-spotify-api'
import Cookies from 'js-cookie'

import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'


export default function App() {
  const [token, setToken] = React.useState(Cookies.get("spotifyAuthToken"))

  return (
    <div className='app'>
      {token ? (
        <SpotifyApiContext.Provider value={token}>
          {/* Your Spotify Code here */}
          <p>You are authorized with token: {token}</p>
        </SpotifyApiContext.Provider>
      ) : (
        // Display the login page
        <SpotifyAuth
          redirectUri='http://localhost:3000/callback'
          clientID='29c1316b4c844ab3b3abb8a9fff67957'
          scopes={[Scopes.userReadPrivate, Scopes.userLibraryRead]} // either style will work
          onAccessToken={(token) => setToken(token)}
        />
      )}
    </div>
  )
}
