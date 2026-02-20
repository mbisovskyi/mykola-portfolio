// React imports
import { NavLink } from "react-router-dom";

// Data imports
import navbarData from "../../data/static/navbar.json";
import audioFile from "/assets/audio/background-music.mp3";

import "./Navbar.css";
//import AudioControl from "../audio-control/AudioControl";
import { AudioPlayer }  from "../audio-player/AudioPlayer";
function Navbar() {
    return (
        <>
            <div className="navbar-container">
                <nav className="nav-items">
                    {navbarData.links.map((link, index) => (
                        <NavLink key={index} to={link.url} className="nav-link">{link.name}</NavLink>
                    ))}                       
                </nav>
                <AudioPlayer audio={new Audio(audioFile)}/>
            </div>
        </>
    )
}

export default Navbar;