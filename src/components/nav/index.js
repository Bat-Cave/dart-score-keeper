import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Nav = () => {
  return (
    <nav className="nav">
      <Link to="/">HOME</Link>
      <Link to="/history">HISTORY</Link>
    </nav>
  );
};

export default Nav;
