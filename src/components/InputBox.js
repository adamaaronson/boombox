import React from 'react'
import '../css/InputBox.scss'

export default function InputBox(props) {
    return (
        <div className="input-box">
            <div>
                <label className="name-the-song" htmlFor="song-input">Name the song <strong>and</strong> artist </label>
                <h1 className="round-number">{props.round + 1} / {props.songsPerGame}</h1>
            </div>
            <input
                type="text"
                id="guess-input"
                className="guess-input"
                value={props.guessInputValue}
                onChange={e => props.onChangeGuessInput(e.target.value)}
            />
        </div>
    );
}
