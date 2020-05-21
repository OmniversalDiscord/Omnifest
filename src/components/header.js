import React from "react"
import logo from '../images/logo.png';
import headerStyles from './header.module.css';

const Header = ({ className }) => {
  return (
    <div className={`${className} ${headerStyles.header}`}>
      <img src={logo} />
      <h1>Trash Bash</h1>
    </div>
  )
}

export default Header
