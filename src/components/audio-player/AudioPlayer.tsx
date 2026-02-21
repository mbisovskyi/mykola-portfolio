// React imports
import { useState, useEffect } from 'react';

import styles from './AudioPlayer.module.css';
export function AudioPlayer({ audio }: AudioPlayerProps){

    const [volume, setVolume] = useState<number>(0.1);
    const [playing, setPlaying] = useState<boolean>(false);
    
    const repeatTimeoutTime: number = 3000;
    const audioSettingsStorageItemName: string = "audioSettings";

// #region Rendering

    // Effect on the entire component reload
    useEffect(() => {
        initAudio(audio);
        initAudioAutoPlay(audio);        
        initAudioEnded(audio);
        initBeforeUnload(audio);
    }, [])

    // Effect on the [volume, playing] state update
    useEffect(() => {
        const audioSettings: AudioSettings = getAudioSettings(audio);
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

/**
 * Compiles current/default AudioSettings object.
 * @returns AudioSettings
 */
function getAudioSettings(): AudioSettings;
/**
 * Compiles AudioSettings object from Audio HTMLAudioElement object.
 * @param audio - object to compile settings from.
 * @returns AudioSettings
 */
function getAudioSettings(audio: HTMLAudioElement): AudioSettings;
/**
 * Compiles saved into storage settings. In case when item in storage is not found or not parsable null is returned.
 * @param itemName - storage item name to parse settings from.
 * @returns AudioSettings | null
 */
function getAudioSettings(itemName: string): AudioSettings | null;
function getAudioSettings(arg1?: HTMLAudioElement | string): AudioSettings | null {

    // Initialize default AudioSettings object
    let audioSettings: AudioSettings = {
        volume: volume,
        playing: playing,
        time: 0
    }

    // Check if any argument is provided
    if (arg1){
        switch (true) {

            // If argument is HTMLAudioElement then get its settings
            case arg1 instanceof HTMLAudioElement:
                audioSettings.volume = audio.volume;
                audioSettings.time = audio.currentTime;
                break;

            // Use provided storage item name to pull settings from
            // If not found or not parsable - return null
            case typeof arg1 === "string":
                const item: string | null = sessionStorage.getItem(arg1);
                if (item) {
                    const parsedItem: AudioSettings = JSON.parse(item);
                    if (parsedItem) {
                        audioSettings = parsedItem
                    } else {
                        return null;
                    };
                }
                break;
            default:
                break;
        }
    }
    
    return audioSettings;
}

function setAudioSettingsToStorage(audioSettings: AudioSettings) {
    sessionStorage.setItem(audioSettingsStorageItemName, JSON.stringify(audioSettings));
}

function initAudio(audio: HTMLAudioElement) {
    // Try to init audio using settings saved into storage.
    let audioSettings: AudioSettings | null = getAudioSettings(audioSettingsStorageItemName);

    // If no audio setting saved in the storage, get current/default settings
    if (!audioSettings) audioSettings = getAudioSettings();
    // Init audio
    audio.volume = audioSettings.volume;
    audio.currentTime = audioSettings.time;

    // Set state variable
    setVolume(audioSettings.volume);
    setPlaying(audioSettings.playing);
}   

function initBeforeUnload(audio: HTMLAudioElement){
    const handler = () => {
            let audioSettings: AudioSettings = getAudioSettings(audio);
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

function initAudioAutoPlay(audio: HTMLAudioElement){
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