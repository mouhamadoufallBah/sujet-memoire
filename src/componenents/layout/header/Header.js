import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <>
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container px-5">
                    <a className="navbar-brand" href="index.html">Start Bootstrap</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" to="/home">Acceuil</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/mesPostes">Mes Postes</Link></li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" id="navbarDropdownPortfolio" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">User</a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownPortfolio">
                                    <li><a className="dropdown-item" href="http://localhost:3000/login">Se deconnecter</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header