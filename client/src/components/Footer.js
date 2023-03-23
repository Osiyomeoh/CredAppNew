import React from "react";
import bank from "../images/neww.png";
import samuelAvatar from "../images/new_cool.jpg";

const Footer = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-center">
        {/* Logo */}
        <a className="navbar-brand" href="/">
          <img
            src={bank}
            width="110"
            height="40"
            className="d-inline-block align-top"
            alt="bank"
          />
        </a>
        {/* Copyright */}
        <div className="navbar-text text-white text-center">
          © 2023 Grandida Inc. All rights reserved. | Created by Sam Ale
          {/* Samuel's Avatar */}
          <img
            src={samuelAvatar}
            width="30"
            height="30"
            className="d-inline-block align-top rounded-circle ml-2"
            alt="Samuel's avatar"
          />
        </div>
      </div>
    </nav>
  );
};

export default Footer;
