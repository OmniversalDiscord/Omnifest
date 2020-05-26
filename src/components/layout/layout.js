import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"

import Header from './header.js';
import Background from './background.js';
import "./layout.css"

const Layout = ({ children }) => {

  return (
    <>
      <Helmet>
        <title>Trash Bash</title>
      </Helmet>
      <Background />
      <Header />
      <main>{children}</main>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
