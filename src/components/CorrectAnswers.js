import React from 'react'

export default function AnswerBoxes(props) {
    return (
        <div>
            <h2>The song {props.roundOver ? "was" : "is"}...</h2>
            <h3>{(props.roundOver || props.songCorrect) ? props.songTitle : "_____"}</h3>
            <h3>by {(props.roundOver || props.artistCorrect) ? props.artistNames : "_____"}</h3>
        </div>
    );
}
