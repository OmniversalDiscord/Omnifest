import React from "react"
import PropTypes from "prop-types"

import logo from '../images/logo.png';
import discord from '../images/discord.png';
import headerStyles from './header.module.css';

const Header = ({ className }) => {
  return (
    <header className={`${className} ${headerStyles.header}`}>
      <div className={headerStyles.wrapper}>
        <img src={logo}/>
        <h1>Trash Bash</h1>
      </div>
      <div className={headerStyles.wrapper}>
        <a href="https://discord.com/invite/nTJVxjG"><img src={discord}/></a>
      </div>
    </header>
  )
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header
