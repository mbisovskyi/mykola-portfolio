// React imports
import { useState, useEffect } from 'react';

import styles from './AudioPlayer.module.css';
export function AudioPlayer({ audio }: AudioPlayerProps){

    const [repeatTimeoutTime] = useState(3000);
    const [volume, setVolume] = useState<number>(0.1);
    const [playing, setPlaying] = useState<boolean>(false);

// #region Rendering

    // Effect on the entire component reload
    useEffect(() => {
        initAudioFromStorage(audio);
        initAudioEnded(audio);
        initBeforeUnload(audio);
        initAudioAutoPlay(audio, volume, setPlaying);        
    }, [])

    // Effect on the [volume, playing] state update
    useEffect(() => {
        const audioSettings: AudioSettings = getAudioSettingsObject(audio);
        setAudioSettingsToStorage(audioSettings);
    }, [volume, playing])

// #endregion

// #region Template

    return (
        <div className={styles.container}>
            <div>
                <button onClick={() => {handlePlayPause(audio)}}>Play/Pause</button>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {handleVolumeChange(e)}}/>
        </div>
    )

// #endregion

// #region Handlers

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>){
        const volume: number = Number(event.target.value);
        audio.volume = volume;
        setVolume(volume);
    }

    function handlePlayPause(audio: HTMLAudioElement) {
        setPlaying(currentState => {
            const nextState: boolean = !currentState;
            nextState ? audio.play() : audio.pause();
            return nextState;
        });
    }
// #endregion

// #region Component Functions

function getAudioSettingsObject(audio: HTMLAudioElement): AudioSettings {
    const audioSettings: AudioSettings = {
        volume: audio.volume,
        playing: playing,
        time: audio.currentTime
    }

    return audioSettings;
}

function setAudioSettingsToStorage(audioSettings: AudioSettings) {
    sessionStorage.setItem("audioSettings", JSON.stringify(audioSettings));
}

function initAudioFromStorage(audio: HTMLAudioElement){
    const item: string | null = sessionStorage.getItem("audioSettings");
    if (item) {
        const audioSettings: AudioSettings | null = JSON.parse(item);

        if (audioSettings) {

            // initialize audio using parameters that were saved to the storage.
            audio.volume = audioSettings.volume;
            audio.currentTime = audioSettings.time;

            // update volume state variable to set slider to proper position
            setVolume(audio.volume);
        }
    }
}

function initBeforeUnload(audio: HTMLAudioElement){
    const handler = () => {
            let audioSettings: AudioSettings = getAudioSettingsObject(audio);
            setAudioSettingsToStorage(audioSettings);
            window.removeEventListener("beforeunload", handler);
        }

    window.addEventListener("beforeunload", handler);
}

function initAudioEnded(audio: HTMLAudioElement) {
    let timeoutId: number | null = null;

    const handler = () => {
        audio.currentTime = 0
        timeoutId = setTimeout(() => {
            audio.play();
        }, repeatTimeoutTime);
    }

    audio.addEventListener("ended", handler);

    return () => {
        audio.removeEventListener("ended", handler);
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
    }
}

function initAudioAutoPlay(audio: HTMLAudioElement, volume: number, setPlaying: React.Dispatch<React.SetStateAction<boolean>>){
    audio.volume = volume;
    audio.play().then(() => {
        setPlaying(true);
    }).catch(() => {
        const handleOnClick = () => {
            audio.play();
            setPlaying(true);
            window.removeEventListener("click", handleOnClick);
        }
        
        window.addEventListener("click", handleOnClick);
    });
}

// #endregion

}

// #region Interfaces

export interface AudioPlayerProps {
    audio: HTMLAudioElement
}

interface AudioSettings {
    volume: number,
    playing: boolean,
    time: number
}

// #endregion