import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import headerStyles from './header.module.css';

const Header = () => {
  return (
    <StaticQuery
      query={graphql`
        query HeaderQuery {
          logo: file(relativePath: { eq: "logo.png" }) {
            childImageSharp {
              fixed(height: 50) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
          discord: file(relativePath: { eq: "discord.png" }) {
            childImageSharp {
              fixed(height: 50) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
          config: file(relativePath: { eq:"config.json"}) {
            childSettingsJson {
              name,
              discord
            }
          }
        }
    `}
    render = {data => (
      <header className={`${headerStyles.header}`}>
        <div className={headerStyles.wrapper}>
          <Img fixed={data.logo.childImageSharp.fixed} />
          <h1>{data.config.childSettingsJson.name}</h1>
        </div>
        <div className={headerStyles.wrapper}>
          <a href={data.config.childSettingsJson.discord}>
            <Img fixed={data.discord.childImageSharp.fixed} />
          </a>
        </div>
      </header>
    )}
    />
  )
}

export default Header
