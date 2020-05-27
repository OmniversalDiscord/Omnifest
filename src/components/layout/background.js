import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import Particles from 'react-particles-js';
import BackgroundImage from 'gatsby-background-image'

import particleSettings from '../../../assets/settings/particles.json';

const bgStyles = {
    position: "fixed", 
    top: "0", 
    left: "0", 
    height: "100%", 
    width: "100%", 
}

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
            config: file(relativePath: { eq:"config.json"}) {
                childSettingsJson {
                    background
                }
            }
        }
    `}
    render = {data => {
        const bgType = data.config.childSettingsJson.background;
        if (bgType === 'particles') {
            return <Particles className='particles' params={particleSettings} style={bgStyles} />;
        } else if (bgType === 'image') {
            return <BackgroundImage fluid={data.background.childImageSharp.fluid} style={{filter: 'blur(25px)', ...bgStyles}} />;
        } else {
            throw new Error(`Background type '${bgType}' is unsupported`);
        }
    }}
    />
  )
}

export default Background
