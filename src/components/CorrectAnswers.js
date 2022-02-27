import React from 'react'
import '../css/CorrectAnswers.scss'
import { getBlanksFor } from '../js/utils'

export default function AnswerBoxes(props) {
    return (
        <div className="correct-answers">
            <div className='song-was'>The song {props.roundOver ? "was" : "is"}...</div>
            <div className='song-result song-title'>
                {(props.roundOver || props.songCorrect) ? props.songTitle : getBlanksFor(props.songTitle)}
            </div>
            <div className='correct-artist'>
                <span className='by'>by</span>
                <span className='artist-name'>
                    {(props.roundOver || props.artistCorrect) ? props.artistNames : getBlanksFor(props.artistNames)}
                </span>
            </div>
        </div>
    )
}
