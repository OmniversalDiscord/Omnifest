import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import { css } from "@emotion/core"
import Particles from "react-particles-js"
import BackgroundImage from "gatsby-background-image"

import particleSettings from "../../../assets/settings/particles.json"

const bgStyles = css`
  position: fixed !important;
  height: 100%;
  width: 100%;
  z-index: 0;
`

// Image needs to be larger than the display area to cut off black bars
const imgBgStyles = css`
  ${bgStyles};
  margin: -20px;
  height: 120%;
  width: 120%;
  filter: blur(10px);
`

const Background = () => {
  return (
    <StaticQuery
      query={graphql`
        query BackgroundQuery {
          background: file(relativePath: { eq: "bg.png" }) {
            childImageSharp {
              fluid(maxWidth: 2560) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          config: file(relativePath: { eq: "config.json" }) {
            childSettingsJson {
              background
            }
          }
        }
      `}
      render={data => {
        const bgType = data.config.childSettingsJson.background
        if (bgType === "particles") {
          return <Particles params={particleSettings} css={bgStyles} />
        } else if (bgType === "image") {
          return (
            <BackgroundImage
              fluid={data.background.childImageSharp.fluid}
              css={imgBgStyles}
            />
          )
        } else {
          throw new Error(`Background type '${bgType}' is unsupported`)
        }
      }}
    />
  )
}

export default Background
