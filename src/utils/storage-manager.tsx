import type AudioSettings from '../interfaces/audio-settings';

/**
 * Loads settings saved to storage if found and parsable, then resets it to the storage with values provided.
 * @param itemName - Name of item saved into session storage.
 * @param audio - If provided, current audio parameters will be loaded into the settings object.
 * @param values - Settings parameter will be overriden by specified value.
 * @returns True if operation succesful, otherwise False.
 */
export function resetAudioSettingsToStorage(itemName: string, audio?: HTMLAudioElement, values?: {volume?: number, playing?: boolean, time?: number}): boolean {
    let success: boolean = false;
    let audioSettings: AudioSettings | null = null;
    audioSettings = audio ? loadAudioSettingsFromStorage(itemName, audio) : loadAudioSettingsFromStorage(itemName);

    if (audioSettings) {
        audioSettings.volume = values?.volume ?? audioSettings.volume;
        audioSettings.playing = values?.playing ?? audioSettings.playing;
        audioSettings.time = values?.time ?? audioSettings.time;

        saveAudioSettingsToStorage(itemName, audioSettings);
        success = true;
    } 

    return success;
};

/**
 * Sets AudioSettings object into session storage.
 * @param itemName - Name of item saved into session storage.
 * @param audioSettings - Settings object to write into storage.
 */
export function saveAudioSettingsToStorage(itemName: string, audioSettings: AudioSettings): void {
    sessionStorage.setItem(itemName, JSON.stringify(audioSettings));
};

/**
 * Gets AudioSettings object from the session storage.
 * @param itemName - Name of item saved into session storage.
 * @param audio - If provided then loaded settings object parameters will be overriden by audio parameters.
 * @returns AudioSettings object if was found in storage and parsable.
 */
export function loadAudioSettingsFromStorage(itemName: string, audio?: HTMLAudioElement): AudioSettings | null {
    let audioSettings: AudioSettings | null = null;
    const item: string | null = sessionStorage.getItem(itemName);
    if (item) {
        const parsedItem: AudioSettings = JSON.parse(item);
        if (parsedItem) {
            audioSettings = parsedItem

            // Transfer audio parameters to settings object if audio argument provided
            if (audio) {
                audioSettings.volume = audio.volume;
                audioSettings.time = audio.currentTime;
            }
        }
    }

    return audioSettings;
};