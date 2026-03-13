// React imports
import { useEffect }  from "react";
import { useLocation } from "react-router-dom";

// Data imports
import homeData from "../../data/static/home.json";
import orbitsData from "../../data/static/orbits.json";

// Interface imports
import type ImageInterface from "../../interfaces/image";
import type OrbitInterface from "../../interfaces/orbit";

// Component imports
import { Orbit } from "../../components/orbit/Orbit";

import styles from "./HomePage.module.css";
function HomePage() {
    const mykolaImage: ImageInterface | undefined = homeData.images.find(image => image.name === "mykola");
    const location = useLocation();

    const orbits: OrbitInterface[] = JSON.parse(JSON.stringify(orbitsData)) as OrbitInterface[];

    // Page Load effects
    const slideInDuration: number = 1000; // in milliseconds
    const fadeInDuration: number = 400; // in milliseconds
    const fadeInDelay: number = 1000; // in milliseconds

    useEffect(() => {
        if (location.pathname !== "/") return;
        document.body.classList.add("no-x-scrollbar");

        setTimeout(() => {
            document.body.classList.remove("no-x-scrollbar");
        }, slideInDuration);
    }, [location.pathname]);

    return (
        <>
            <div className="page-container">

                {/* Profile Card */}
                <div id={styles.profileCard} style={{ "--slide-in-duration": `${slideInDuration}ms` } as React.CSSProperties}>
                    <img src={mykolaImage?.path} alt={mykolaImage?.alt} className={styles.profileImage} width={mykolaImage?.defaultWidth || 400} onContextMenu={(e) => e.preventDefault()}/>
                    <div id={styles.profileInfo} style={{ "--fade-in-duration": `${fadeInDuration}ms`, "--fade-in-delay": `${fadeInDelay}ms` } as React.CSSProperties}>
                        <h2>{homeData.name}</h2>
                        <h3>{homeData.title}</h3>
                    </div>
                </div>

                {/* Orbits */}
                <div>
                    {orbits.map((orbitConfig, index) => (
                        <Orbit key={index} {...orbitConfig}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default HomePage;