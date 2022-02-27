import React from 'react'

export default function InputBox(props) {
    return (
        <div className="input-box">
            <input
                type="text"
                id="guess-input"
                className="guess-input"
                value={props.guessInputValue}
                onChange={e => props.onChangeGuessInput(e.target.value)}
            />
            <div>
                <label htmlFor="song-input">Can you name the song and artist?</label>
            </div>
        </div>
    );
}
