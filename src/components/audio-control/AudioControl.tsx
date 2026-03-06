// React imports
import { useState, useEffect, useRef } from 'react';

// Utils imports
import { loadAudioSettingsFromStorage, resetAudioSettingsToStorage, saveAudioSettingsToStorage } from '../../utils/storage-manager';

// React Icon imports
import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { FiVolume2 } from "react-icons/fi";

// Type imports
import type AudioSettings from '../../interfaces/audio-settings';

import styles from './AudioControl.module.css';
export function AudioControl({ audio }: AudioControlProps){

    const repeatTimeoutTime: number = 3000;
    const audioSettingsStorageItemName: string = "audioSettings";

    const volumeSliderRef = useRef<HTMLDivElement>(null);

    const [playing, setPlaying] = useState<boolean>(() => {
        const audioSettings: AudioSettings | null = loadAudioSettingsFromStorage(audioSettingsStorageItemName);
        if (!audioSettings) return false;
        return audioSettings.playing;
    });
    const [volume, setVolume] = useState<number>(() => {
        const audioSettings: AudioSettings | null = loadAudioSettingsFromStorage(audioSettingsStorageItemName);
        if (!audioSettings) return 0.1;
        return audioSettings.volume;
    });


// #region Rendering

    // Effect on the entire component reload
    useEffect(() => {
        initAudioAutoPlay(audio);        
        initAudio(audio);
        initAudioEnded(audio);
        initBeforeUnload(audio);
    }, [])

// #endregion

// #region Template

    return (
        <div className={styles.container}>
            <div className={styles.audioControlButtons}>
                {playing ? 
                    <div className={styles.audioControlButton}>
                        <FiPauseCircle onClick={() => {handlePlayPause(audio)}}/>
                    </div> 
                : 
                    <div className={styles.audioControlButton}>
                        <FiPlayCircle onClick={() => {handlePlayPause(audio)}}/>
                    </div>
                }

                <div className={styles.volumeContainer} onMouseOver={handleVolumeMouseOver} onMouseOut={handleVolumeMouseOut}>
                    <FiVolume2 className={styles.audioControlButton} />
                    <div className={`${styles.volumeSlider} ${styles.hideVolumeSlider}`} ref={volumeSliderRef}>
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {handleVolumeChange(e)}}/>
                    </div>
                </div>
            </div>
            
        </div>
    )

// #endregion

// #region Handlers

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>){
        const volume: number = Number(event.target.value);
        audio.volume = volume;
        setVolume(volume);
        resetAudioSettingsToStorage(audioSettingsStorageItemName, audio);
    }

    function handlePlayPause(audio: HTMLAudioElement) {
        setPlaying(currentState => {
            const nextState: boolean = !currentState;
            nextState ? audio.play() : audio.pause();
            resetAudioSettingsToStorage(audioSettingsStorageItemName, audio, { playing: nextState });
            return nextState;
        });
    }

    function handleVolumeMouseOver(): void {
        if (volumeSliderRef?.current?.classList) {
            volumeSliderRef.current.classList.remove(styles.hideVolumeSlider);
            volumeSliderRef.current.classList.add(styles.showVolumeSlider);
        }
    }

    function handleVolumeMouseOut(): void {
        if (volumeSliderRef?.current?.classList) {
            volumeSliderRef.current.classList.remove(styles.showVolumeSlider);
            volumeSliderRef.current.classList.add(styles.hideVolumeSlider);
        }
    }
// #endregion

// #region Component Functions

function initAudio(audio: HTMLAudioElement) {
    // Try to init audio using settings saved into storage.
    let audioSettings: AudioSettings | null = loadAudioSettingsFromStorage(audioSettingsStorageItemName);

    if (audioSettings) {
        // Init audio
        audio.volume = audioSettings.volume;
        audio.currentTime = audioSettings.time;

        // Set state variable
        setVolume(audioSettings.volume);
        setPlaying(audioSettings.playing);
    }
}   

function initBeforeUnload(audio: HTMLAudioElement){
    const handler = () => {
            resetAudioSettingsToStorage(audioSettingsStorageItemName, audio);
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
    let audioSettings: AudioSettings | null = loadAudioSettingsFromStorage(audioSettingsStorageItemName, audio);
    let allowPlaying: boolean = false;

    if (audioSettings)
    {
        setPlaying(audioSettings.playing);
        allowPlaying = audioSettings.playing;
    } else {
        setPlaying(true);
        allowPlaying = true;
        audio.volume = volume;
    }

    if (allowPlaying) {
        audio.play().then(() => {
            setPlaying(true);
            audioSettings = {
                volume: audio.volume,
                playing: true,
                time: audio.currentTime
            }
            saveAudioSettingsToStorage(audioSettingsStorageItemName, audioSettings);
        }).catch(() => {
            const handleOnClick = () => {
                audio.play();
                setPlaying(true);
                audioSettings = {
                    volume: audio.volume,
                    playing: true,
                    time: audio.currentTime
                }
                saveAudioSettingsToStorage(audioSettingsStorageItemName, audioSettings);
                window.removeEventListener("click", handleOnClick);
            }
            
            window.addEventListener("click", handleOnClick);
        });
    }    
}

// #endregion

// #region Internal Interfaces

}

interface AudioControlProps {
    audio: HTMLAudioElement
}

// #endregion