import React, { useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import Playlists from '../js/playlists'
import CorrectAnswers from './CorrectAnswers.js'
import InputBox from './InputBox.js'
import {getStrippedArtists, getStrippedTitles, shuffle, stripString, listToString} from '../js/utils';

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
    
    useEffect(() => {
        // Initialize the Spotify API instance
        let spotifyApi = new SpotifyWebApi()
        spotifyApi.setAccessToken(props.token)

        // Choose random songs from a given playlist to use for the game
        getRandomSongsFromPlaylist(spotifyApi, Playlists.allOut2010s, SONGS_PER_GAME)
    }, [gameIndex])

    // check if guessInput is the same as the song title or one of the artist names
    useEffect(() => {
        if (!getCurrentSong()) {
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
        <div>
            {!gameStarted &&
                <div>
                    <div>Make sure your sound is on!</div>
                    <button onClick={startGame}>Start game</button>
                </div>
            }

            {gameEnded && 
                <div>
                    <h2>Final Score: {artistScore + songScore}</h2>
                    <div>Breakdown: {songScore} songs correct, {artistScore} artists correct!</div>
                    <button onClick={resetGame}>Play Again!</button>
                </div>
            }

            {gameStarted && !gameEnded &&
                <div>
                    <h2>Round: {round + 1}</h2>
                    { roundOver ?
                        <button onClick={startNextRound}>{round + 1 === SONGS_PER_GAME ? "See results" : "Next round"}</button>
                        : <button onClick={endCurrentRound}>I HAVE NO IDEA</button>
                    }
                    <div>
                        <div>Score: {songScore} songs correct, {artistScore} artists correct</div>
                    </div>
                    <div>
                        <div>{seconds}s</div>
                    </div>
                    {songs &&
                        <div>
                            {/* <p>SUPER SECRET Song: {getCurrentSong().title}</p>
                            <p>SUPER SECRET Artist(s): {getCurrentSong().artists && listToString(getCurrentSong().artists)}</p> */}

                            <InputBox
                                guessInputValue={guessInput}
                                onChangeGuessInput={setGuessInput}
                            />

                            <CorrectAnswers 
                                songTitle={getCurrentSong().title}
                                artistNames={listToString(getCurrentSong().artists)}
                                songCorrect={songCorrect}
                                artistCorrect={artistCorrect}
                                roundOver={roundOver}
                            />
                        </div>
                    }
                </div>
            }
            
        </div>
    )
}
