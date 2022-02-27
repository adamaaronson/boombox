import React, { useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import Playlists from '../js/playlists'
import {getStrippedArtists, getStrippedTitles, shuffle, stripString, listToString} from '../js/utils';
// import Timer from '../components/Timer.js'

const SONGS_PER_ROUND = 10;
var id = 0;

export default function GamePage(props) {
    const [gameStarted, setGameStarted] = useState(false);
    const [songs, setSongs] = useState(null);
    const [round, setRound] = useState(-1);
    const [audio, setAudio] = useState(new Audio(''));
    const [playing, setPlaying] = useState(false);
    const [guessInput, setGuessInput] = useState('');
    const [songCorrect, setSongCorrect] = useState(false);
    const [artistCorrect, setArtistCorrect] = useState(false);

    const [seconds, setSeconds] = useState(30);
    const [isActive, setIsActive] = useState(true)
    
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
                        strippedTitles: getStrippedTitles(song.name),
                        strippedArtists: getStrippedArtists(song.artists.map(artist => artist.name))
                    })
                )
                setSongs(songs)
            }, function(err) {
                console.error(err);
            });
    };

    const getCurrentSong = () => {
        return songs ? songs[round] : null
    }

    const startGame = () => {
        startNextRound()

        setGameStarted(true)
    }

    const startNextRound = () => {
        audio.pause()

        stopPlayingSong()

        setRound(round + 1)

        setAudio(new Audio())

        setSongCorrect(false)
        setArtistCorrect(false)

        resetTimer()
    }

    const startPlayingSong = () => {
        setPlaying(true)
    }

    const stopPlayingSong = () => {
        setPlaying(false)
    }

    function resetTimer() {
        if (id) {
            setSeconds(0);
            clearTimeout(id);
            setSeconds(30);
        } 
    }

    function stopTimer() {
        if (id) {
            setSeconds(0);
            clearTimeout(id);
        }
    }
    
    useEffect(() => {
        // Initialize the Spotify API instance
        let spotifyApi = new SpotifyWebApi()
        spotifyApi.setAccessToken(props.token)

        // Choose random songs from a given playlist to use for the game
        getRandomSongsFromPlaylist(spotifyApi, Playlists.allOut2010s, SONGS_PER_ROUND)

        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [])

    // Updates the song for each new round
    useEffect(() => {
        songs && setAudio(new Audio(getCurrentSong().previewUrl));
    }, [round])

    // Toggles audio playing
    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing]);

    // check if guessInput is the same as the song title or one of the artist names
    useEffect(() => {
        if (!getCurrentSong()) {
            return
        }

        if (getCurrentSong().strippedTitles.includes(stripString(guessInput))) {
            setSongCorrect(true)
        }
        
        if (getCurrentSong().strippedArtists.includes(stripString(guessInput))) {
            setArtistCorrect(true)
        }
    }, [guessInput])

    // updates timer
    useEffect(() => {
        if (seconds > 0) {
            id = setTimeout(() => setSeconds(seconds - 1), 1000);
        }
    }, [seconds]);
    
    return (
        <div>
            {!gameStarted &&
                <button onClick={startGame}>Start game</button>
            }
            {gameStarted &&
                <div>
                    <h2>Round: {round + 1}</h2>
                    <button onClick={startNextRound}>Next round</button>
                    <div>
                        <div>{seconds}s</div>
                        {/* <button onClick={resetTimer}>Reset</button> */}
                    </div>
                    {songs && 
                        <div>
                            <p>Song: {getCurrentSong().title}</p>
                            <p>Artist(s): {getCurrentSong().artists && listToString(getCurrentSong().artists)}</p>

                            <button onClick={startPlayingSong}>Play</button>
                            <button onClick={stopPlayingSong}>Pause</button>

                            <div className="input-boxes">
                                <input
                                    type="text"
                                    id="guess-input"
                                    className="guess-input"
                                    value={guessInput}
                                    onChange={e => setGuessInput(e.target.value)}
                                />
                                <div>
                                    <label htmlFor="song-input">Can you name the song and artist?</label>
                                </div>
                            </div>

                            <div className="revealer-boxes">
                                {songCorrect && <p>Correct! Song: {getCurrentSong().title}</p>}
                                {artistCorrect && <p>Correct! Artist(s): {getCurrentSong().artists && listToString(getCurrentSong().artists)}</p>}
                            </div>
                            
                        </div>
                    }
                </div>
            }
            
        </div>
    )
}
