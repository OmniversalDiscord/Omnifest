import React from "react"
import PropTypes from "prop-types"

import logo from '../images/logo.png';
import headerStyles from './header.module.css';

const Header = ({ className }) => {
  return (
    <header className={`${className} ${headerStyles.header}`}>
      <img src={logo} />
      <h1>Trash Bash</h1>
    </header>
  )
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header
