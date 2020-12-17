module.exports = {
  plugins: [
    `gatsby-transformer-json`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `settings`,
        path: `${__dirname}/assets/settings`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Holiday Bash",
        short_name: "Holiday Bash",
        start_url: "/",
        background_color: "#000000",
        theme_color: "#000000",
        display: "browser",
        icon: `${__dirname}/assets/images/icon.png`,
      },
    },
  ],
}
