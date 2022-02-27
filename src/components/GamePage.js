import React, { useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Playlists from '../js/playlists'
import Messages from '../js/messages'
import CorrectAnswers from './CorrectAnswers.js'
import InputBox from './InputBox.js'
import Header from './Header.js'
import {getStrippedArtists, getStrippedTitles, shuffle, stripString, listToString} from '../js/utils';
import '../css/GamePage.scss'
import '../css/GenreButtons.scss'
import Footer from './Footer'

const SONGS_PER_GAME = 5;
const SECONDS_PER_ROUND = 30;
var timerId = 0;

export default function GamePage(props) {
    // game state
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameIndex, setGameIndex] = useState(0);
    const [round, setRound] = useState(-1);
    const [seconds, setSeconds] = useState(SECONDS_PER_ROUND);
    const [roundOver, setRoundOver] = useState(false);

    // music state
    const [songs, setSongs] = useState(null);
    const [audio, setAudio] = useState(new Audio(''));
    
    // answers state
    const [guessInput, setGuessInput] = useState('');
    const [songCorrect, setSongCorrect] = useState(false);
    const [songScore, setSongScore] = useState(0)
    const [artistCorrect, setArtistCorrect] = useState(false);
    const [artistScore, setArtistScore] = useState(0)
    
    const getRandomSongsFromPlaylist = (spotifyApi, playlistId, numSongs) => {
        spotifyApi.getPlaylistTracks(playlistId)
            .then(function(data) {
                let songs = data.items.map(x => x.track)
                songs = songs.filter(x => x.preview_url)
                songs = shuffle(songs).slice(0, numSongs)
                songs = songs.map(song => ({
                        title: song.name,
                        previewUrl: song.preview_url,
                        artists: song.artists.map(artist => artist.name),
                        popularity: song.popularity,
                        strippedTitles: getStrippedTitles(song.name),
                        strippedArtists: getStrippedArtists(song.artists.map(artist => artist.name))
                    })
                )
                // sort songs in order of descending popularity
                songs = songs.sort((a, b) => (b.popularity - a.popularity))
                setSongs(songs)
            }, function(err) {
                console.error(err);
            });
    };

    const setPlaylist = (playlist) => {
        let spotifyApi = new SpotifyWebApi()
        spotifyApi.setAccessToken(props.token)
        getRandomSongsFromPlaylist(spotifyApi, playlist, SONGS_PER_GAME)
    }

    const getCurrentSong = () => {
        return songs ? songs[round] : null
    };

    const resetGame = () => {
        setGameIndex(gameIndex + 1);
        setGameEnded(false);
        setGameStarted(false);
        setRound(-1);
        setSeconds(SECONDS_PER_ROUND);
        setRoundOver(false);
    };

    useEffect(() => {
        if (songs) {
            startGame()
        }
    }, [songs])

    const startGame = () => {
        startNextRound()
        setGameStarted(true)
    }

    const startNextRound = () => {
        if (round + 1 === SONGS_PER_GAME) {
            setGameEnded(true)
            return
        }
        let nextSong = songs[round + 1]
        let nextAudio = new Audio(nextSong.previewUrl)

        setAudio(nextAudio)
        setRound(round + 1)
        setSongCorrect(false)
        setArtistCorrect(false)
        setGuessInput('')
        setRoundOver(false)
        resetTimer()
        
        nextAudio.play()
    }

    const endCurrentRound = () => {
        audio.pause();
        
        stopTimer()
        setRoundOver(true)
    }

    function resetTimer() {
        if (timerId) {
            setSeconds(0);
            clearTimeout(timerId);
            setSeconds(SECONDS_PER_ROUND);
        } 
    }

    function stopTimer() {
        if (timerId) {
            clearTimeout(timerId);
        }
    }

    function getMessage(score) {
        if (score <= 5) {
            return Messages.bad
        }
        else if (5 < score <= 10) {
            return Messages.ok
        }
        else if (10 < score <= 15) {
            return Messages.good
        }
        else {
            return Messages.verygood
        }
    }
    
    // useEffect(() => {
    //     // Initialize the Spotify API instance
    //     let spotifyApi = new SpotifyWebApi()
    //     spotifyApi.setAccessToken(props.token)

    //     // Choose random songs from a given playlist to use for the game
    //     getRandomSongsFromPlaylist(spotifyApi, playlistID, SONGS_PER_GAME)
    // }, [gameIndex, playlistID])

    // check if guessInput is the same as the song title or one of the artist names
    useEffect(() => {
        if (!getCurrentSong() || roundOver) {
            return
        }

        if (getCurrentSong().strippedTitles.includes(stripString(guessInput))) {
            setSongCorrect(true)
            setGuessInput('')
            setSongScore(songScore + 1);
        }
        
        if (getCurrentSong().strippedArtists.includes(stripString(guessInput))) {
            setArtistCorrect(true)
            setGuessInput('')
            setArtistScore(artistScore + 1);
        }
    }, [guessInput])

    // check if song and artist are both correct
    useEffect(() => {
        if (songCorrect && artistCorrect) {
            endCurrentRound();
        }
    }, [songCorrect, artistCorrect])

    // updates timer
    useEffect(() => {
        if (gameStarted && seconds > 0 && !roundOver) {
            timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            endCurrentRound();
        }
    }, [seconds, gameStarted]);
    
    return (
        <div className={"game-page" + (gameStarted ? " game-page-begun" : " game-page-unbegun")}>
            <Header/>
            {!gameStarted &&
                <div>
                    <div className='genre-button-wrapper'>
                        <button onClick={() => setPlaylist(Playlists.allOut1960s)} className='genre-button nice-button'>1960s</button>
                        <button onClick={() => setPlaylist(Playlists.allOut1970s)} className='genre-button nice-button'>1970s</button>
                        <button onClick={() => setPlaylist(Playlists.allOut1980s)} className='genre-button nice-button'>1980s</button>
                        <button onClick={() => setPlaylist(Playlists.allOut1990s)} className='genre-button nice-button'>1990s</button>
                        <button onClick={() => setPlaylist(Playlists.allOut2000s)} className='genre-button nice-button'>2000s</button>
                        <button onClick={() => setPlaylist(Playlists.allOut2010s)} className='genre-button nice-button'>2010s</button>
                    </div>
                    {/* <button className="nice-button start-button" onClick={startGame}>begin</button> */}
                    
                    <div className="start-tip">Make sure your sound is on! 🔊</div>
                </div>
            }

            {gameEnded &&
                <div>
                    <div className='game-end-stats'>
                        <div className='song-result-head'>Final Score</div> 
                        <div className='song-result overall-score'>{artistScore + songScore}</div>
                    </div>
                    <div className='individual-stats'>
                        <div className="song-stats">
                            <div className='song-result-head'>Songs</div> 
                            <div className='song-result'>{songScore}/{SONGS_PER_GAME}</div>
                        </div>
                        <div className="artist-stats">
                            <div className='song-result-head'>Artists</div> 
                            <div className='song-result'>{artistScore}/{SONGS_PER_GAME}</div>
                        </div>
                    </div>
                    <div className="end-tip">{getMessage(artistScore+songScore)}</div>
                    <button className="play-again-button nice-button" onClick={resetGame}>Play Again</button>
                </div>
            }

            {gameStarted && !gameEnded &&
                <div>
                    {/* <div>
                        <div>Score: {songScore} songs correct, {artistScore} artists correct</div>
                    </div> */}
                    <div className="countdown-timer">
                        <CountdownCircleTimer
                            isPlaying={!roundOver}
                            duration={SECONDS_PER_ROUND}
                            colors="#303030"
                            trailColor="#eeee"
                            strokeWidth={65}
                            strokeLinecap="butt"
                            size={200}
                            key={round}
                        >
                            {({ remainingTime }) => <div className="timer-text">{seconds}</div>}
                        </CountdownCircleTimer>
                    </div>
                    
                    {songs &&
                        <div>
                            {/* <p>SUPER SECRET Song: {getCurrentSong().title}</p>
                            <p>SUPER SECRET Artist(s): {getCurrentSong().artists && listToString(getCurrentSong().artists)}</p> */}

                            <InputBox
                                guessInputValue={guessInput}
                                onChangeGuessInput={setGuessInput}
                                round={round}
                                songsPerGame={SONGS_PER_GAME}
                            />

                            <CorrectAnswers 
                                songTitle={getCurrentSong().title}
                                artistNames={listToString(getCurrentSong().artists)}
                                songCorrect={songCorrect}
                                artistCorrect={artistCorrect}
                                roundOver={roundOver}
                            />

                            { !roundOver &&
                                <button className="idk nice-button" onClick={endCurrentRound}>IDK</button>
                            }

                            { roundOver &&
                                <button className="next-round-button nice-button" onClick={startNextRound}>{round + 1 === SONGS_PER_GAME ? "See results" : "Next round"}</button>
                            }
                        </div>
                    }
                </div>
            }
            
        </div>
    )
}
