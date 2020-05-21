import React from "react"
import PropTypes from "prop-types"
import particleSettings from '../settings/particlesjs-config.json';

import Particles from 'react-particles-js';

import Header from './header.js';
import "./layout.css"

const Layout = ({ children }) => {

  return (
    <>
      <Particles className="particles"
        params={particleSettings}
      />
      <Header className="header"></Header>
      <main>{children}</main>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
