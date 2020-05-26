import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import Particles from 'react-particles-js';

import particleSettings from '../../../assets/settings/particles.json';

const Background = () => {
  return (
    <StaticQuery
      query={graphql`
        query BackgroundQuery {
            background: file(relativePath: { eq: "bg.png" }) {
                childImageSharp {
                    fluid(maxHeight: 100) {
                        src
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
            return <Particles className="particles" params={particleSettings}/>;
        } else if (bgType === 'image') {
            return (<div></div>);
        } else {
            throw new Error(`Background type '${bgType}' is unsupported`);
        }
    }}
    />
  )
}

export default Background
