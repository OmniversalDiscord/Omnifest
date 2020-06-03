import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import styled from "@emotion/styled"

const HeaderWrapper = styled.header`
  height: 50px;
  display: flex;
  margin: 2px 6px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  top: 0px;
  left: 0px;
  position: fixed;
`

const HeaderElement = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  padding-left: 2px;
  padding-right: 4px;

  & > h1 {
    margin: 0px;
    margin-bottom: 2px;
    margin-left: 8px;
    font-size: 20px;
  }
`

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
          config: file(relativePath: { eq: "config.json" }) {
            childSettingsJson {
              name
              discord
            }
          }
        }
      `}
      render={data => (
        <HeaderWrapper>
          <HeaderElement>
            <Img fixed={data.logo.childImageSharp.fixed} />
            <h1>{data.config.childSettingsJson.name}</h1>
          </HeaderElement>
          <HeaderElement>
            <a href={data.config.childSettingsJson.discord}>
              <Img fixed={data.discord.childImageSharp.fixed} />
            </a>
          </HeaderElement>
        </HeaderWrapper>
      )}
    />
  )
}

export default Header
