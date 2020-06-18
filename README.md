# Omnifest Website

The site for all Omniversal URL festivals, built in Gatsby.

## Configuring the site

All config for the site can be done in `assets/`. `settings` contains the main JSON configuration and `images` can be swapped out with new images as required. 

Of note in `config.json` is the background setting, which can either be `particles` or `image`. If particles is set, a valid `particles.json` must also be placed in `settings`, which can be generated [here](https://vincentgarreau.com/particles.js/). If `image` is set, an image titled `bg.png` must be placed in `images`.

## Building the site

```
npm install -g gatsby-cli
git clone https://github.com/OmniversalDiscord/omnifest-website.git
cd omnifest-website
npm install
gatsby build
```
