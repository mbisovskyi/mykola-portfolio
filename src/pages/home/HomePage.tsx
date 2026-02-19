// React imports
import { useEffect }  from "react";
import { useLocation } from "react-router-dom";

// Data imports
import homeData from "../../data/static/home.json";

// Asset imports
import swooshAudio from "/assets/audio/swoosh.mp3";

// Interface imports
import type ImageInterface from "../../interfaces/image";

import styles from "./HomePage.module.css";
function HomePage() {
    const swooshAudioInstance = new Audio(swooshAudio);
    const mykolaImage: ImageInterface | undefined = homeData.images.find(image => image.name === "mykola");
    const location = useLocation();

    // Page Load effects
    const slideInDuration: number = 1000; // in milliseconds
    const fadeInDuration: number = 400; // in milliseconds
    const fadeInDelay: number = 1000; // in milliseconds

    useEffect(() => {
        if (location.pathname !== "/") return;
        document.body.classList.add("no-x-scrollbar");
        //startProfileCardAudio(0.4);

        setTimeout(() => {
            document.body.classList.remove("no-x-scrollbar");
        }, slideInDuration);
    }, [location.pathname]);

    function startProfileCardAudio(volume: number): void {
        swooshAudioInstance.volume = volume;
        swooshAudioInstance.play();
    }

    return (
        <>
            <div className="page-container">
                <div id={styles.profileCard} style={{ "--slide-in-duration": `${slideInDuration}ms` } as React.CSSProperties}>
                    <img src={mykolaImage?.path} alt={mykolaImage?.alt} className="profile-image" width={mykolaImage?.defaultWidth || 400}/>
                    <div id={styles.profileInfo} style={{ "--fade-in-duration": `${fadeInDuration}ms`, "--fade-in-delay": `${fadeInDelay}ms` } as React.CSSProperties}>
                        <h2>{homeData.name}</h2>
                        <h3>{homeData.title}</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage;