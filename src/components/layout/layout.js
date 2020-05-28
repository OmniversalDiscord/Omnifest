import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { Global, css } from "@emotion/core"
import { StaticQuery, graphql } from "gatsby"

import Background from "./background.js"
import Header from "./header.js"

const globalStyles = props => css`
  @import url("https://use.typekit.net/sjt5wyo.css");
  @import url("https://fonts.googleapis.com/icon?family=Material+Icons+Round");

  html,
  body {
    margin: 0;
    padding: 0;
    background-color: black;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    overflow: hidden;
  }

  #___gatsby,
  #gatsby-focus-wrapper {
    height: 100%;
    width: 100%;
  }

  #visualizer {
    z-index: 9999;
  }

  main {
    max-width: 1000px;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
  }

  h1,
  p {
    color: ${props.foreground};
    font-family: sofia-pro, sans-serif;
  }

  i {
    color: ${props.foreground};
  }

  svg path {
    fill: ${props.foreground};
  }
`

const Layout = ({ children }) => {
  return (
    <StaticQuery
      query={graphql`
        query LayoutQuery {
          config: file(relativePath: { eq: "config.json" }) {
            childSettingsJson {
              foreground
            }
          }
        }
      `}
      render={data => (
        <>
          <Helmet>
            <title>Trash Bash</title>
          </Helmet>
          <Global
            styles={globalStyles({
              foreground: data.config.childSettingsJson.foreground,
            })}
          />
          <Background />
          <Header />
          <main>{children}</main>
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
