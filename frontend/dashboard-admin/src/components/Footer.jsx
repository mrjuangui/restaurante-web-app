import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaGithub, FaLinkedin, FaGlobe, FaHome } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p>© 2025 Juan G. Perales | Todos los derechos reservados.</p>
        <div className="d-flex justify-content-center gap-4 mt-2">

          <a
            href="https://mrjuangui.github.io/landing-page/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FaHome size={24} title="Portafolio" />
          </a>

          <a
            href="https://github.com/mrjuangui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FaGithub size={24} title="GitHub" />
          </a>

          <a
            href="https://www.linkedin.com/in/mrjuangui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FaLinkedin size={24} title="LinkedIn" />
          </a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
