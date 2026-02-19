import { useEffect, useState, useRef } from "react";
import bgMusicFile from "/assets/audio/background-music.mp3";
import styles from "./AudioControl.module.css";
import { GiMusicalNotes as ActiveMusicIcon } from "react-icons/gi";
import { MdOutlineMusicOff as InactiveMusicIcon } from "react-icons/md";
import type AudioSettings from "../../interfaces/audio-settings";

function AudioControl(){

  // Background Music variables
  const bgMusicRef: React.RefObject<HTMLAudioElement> = useRef(new Audio(bgMusicFile));
  const [bgMusicSettings, setBgMusicSettings] = useState<AudioSettings>(initAudio("BgMusic", bgMusicRef.current, 0.5));

  // Render related variables
  const [renderControl, setRenderControl] = useState(false);
  const [minScreenWidth] = useState(768);


/* #region Component Rendering Logic */
  useEffect(() => {
    if (window.innerWidth < minScreenWidth) return;
    setupBgMusic();
  }, []);

  if (!renderControl) return null;

/* #endregion */

/* #region Component Template */
  return (

    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="audioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="50%" stopColor="#71b4ff" />
            <stop offset="100%" stopColor="#50E3C2" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-1 0; 1 0; -1 0"
              dur="3s"
              repeatCount="indefinite"          
            />
          </linearGradient>
        </defs>
      </svg>

      <div id="audioControl" className={`${styles.container} ${styles.displayAnimation}`}>

      {/* Music Active State Icon */}
        {!bgMusicSettings.active ? 
          <button className={`${styles.icon}`} onClick={() => {handleToggleAudio(bgMusicRef.current, setBgMusicSettings)}}><InactiveMusicIcon /></button> 
        : 
          <button className={`${styles.icon}`} onClick={() => {handleToggleAudio(bgMusicRef.current, setBgMusicSettings)}}><ActiveMusicIcon className={styles.activeMusic}/></button>}

        {/* Volume Slider */} 
        <input type="range" min="0" max="1" step="0.01" value={bgMusicSettings.volume} onChange={(e) => {handleAudioVolumeChange(e, bgMusicRef.current, bgMusicSettings, setBgMusicSettings)}}/>
      </div>
    </>


  );
/* #endregion */

/* #region Component Functions */
  function setupBgMusic(){
    const savedSettings: AudioSettings | null = getSavedAudioSettings("BgMusic");

    if (savedSettings) {
      bgMusicRef.current.volume = savedSettings.volume;
      setBgMusicSettings(settings => ({ ...settings, volume: savedSettings.volume, currentTime: savedSettings.currentTime}))

      if (savedSettings.active) {
        bgMusicRef.current.currentTime = savedSettings.currentTime;
      }
    }

    bgMusicRef.current.play().then(() => {
      setRenderControl(true);
      }).catch(() => {
        const startBgMusic_onClick = () => {
          if (!savedSettings) {
            bgMusicRef.current.play();
            setBgMusicSettings(settings => ({...settings, active: true}));
          } else {
            setBgMusicSettings(settings => ({...settings, active: savedSettings.active, currentTime: savedSettings.currentTime}));
            if (savedSettings.active) {
              bgMusicRef.current.play();
            }
          }

          setRenderControl(true);
          window.removeEventListener("click", startBgMusic_onClick);
        };
        
        setBgMusicSettings(settings => ({...settings, active: false}));
        window.addEventListener("click", startBgMusic_onClick);
      });

    return () => {
      bgMusicRef.current.pause();
    };
  }

  function handleToggleAudio(audio: HTMLAudioElement, setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>){
    setAudioSettings(currentState => {
      // capture the next audio active state
      const nextState = !currentState.active; 
      
      // // stop/play audio based on the next audio active state
      toggleAudio(audio, nextState); 

      // set next state to rerender component
      const updated = {...currentState, active: nextState, volume: audio.volume, currentTime: audio.currentTime}; 

      // save audio settings to session storage 
      saveAudioSettings(updated); 
      return updated;
    });
  };
/* #endregion */
}

/* #region Private Functions */
  function initAudio(name: string, audio: HTMLAudioElement, volume: number): AudioSettings {
    // Compile Audio Settings object. Save current time of the audio.
    const settings: AudioSettings = {
      name: name,
      volume: audio.volume > 0 ? audio.volume : volume,
      active: false,
      currentTime: audio.currentTime > 0 ? audio.currentTime : 0
    }

    audio.volume = settings.volume;
    audio.currentTime = settings.currentTime;

    return settings;
  }

  function toggleAudio(audio: HTMLAudioElement, play: boolean) {
    play ? audio.play() : audio.pause();
  }

  function handleAudioVolumeChange(e: React.ChangeEvent<HTMLInputElement>, audio: HTMLAudioElement, audioSettings: AudioSettings, setSettings: React.Dispatch<React.SetStateAction<AudioSettings>>) {
    const newVolume: number = Number(e.target.value);
    
    audio.volume = newVolume;
    setSettings(currentState => {
      const updated = {...currentState, volume: newVolume, currentTime: audio.currentTime }
      saveAudioSettings(audioSettings);
      return updated;
    });
  }

  function saveAudioSettings(audioSettings: AudioSettings): void {
    sessionStorage.setItem(audioSettings.name, JSON.stringify(audioSettings));
  }

  function getSavedAudioSettings(name: string): AudioSettings | null {
    let savedSettings: AudioSettings | null = null;
    const stringSettings: string | null = sessionStorage.getItem(name);

    if (stringSettings) {
      savedSettings = JSON.parse(stringSettings);
    }

    return savedSettings;
  }
/* #endregion */

export default AudioControl;