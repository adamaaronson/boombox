import React from 'react'
import '../css/Header.scss'

export default function Header() {
    return (
        <header>
            <img src='logo.png' alt='Logo'></img>
            <h2 className="subtitle">A MUSICAL GUESSING GAME</h2>
        </header>
    )
}
