// React imports
import { NavLink } from "react-router-dom";

// Data imports
import navbarData from "../../data/static/navbar.json";

import "./Navbar.css";
function Navbar() {
    return (
        <>
            <div className="navbar-container">
                <p className="navbar-brand">{navbarData.brand}</p>
                <nav className="links-container">
                    {navbarData.links.map((link, index) => (
                        <NavLink key={index} to={link.url} className="nav-link">{link.name}</NavLink>
                    ))}
                </nav>


            </div>
        </>
    )
}

export default Navbar;