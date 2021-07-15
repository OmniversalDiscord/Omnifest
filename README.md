# Omnifest

Omniversal's website and server code for handling all URL festivals.

### What's new?

- A brand new 3D visualizer, taken from [this open-source CodePen example](https://codepen.io/mnmxmx/pen/mmZbPK/).
- A viewer count (finally).
- A completely redesigned layout that's far more mobile friendly.

### What's changed?

- The site no longer uses Gatsby. While SSR is super cool and Gatsby is a great framework, in reality since so much of the site is dynamic that Gatsby was effectively being used as a very fancy image and JSON loader library. In the new site we cut out the middleman and went with pure React.
- The site uses Tailwind CSS instead of Emotion because it's super cool.
- The loading icon should actually work 100% of the time now instead of freezing randomly.
- The server for handling the artist and viewer information is now written in C# with ASP.NET Core and SignalR, and is far more robust than the random Express.js file that was holding everything together before.

### Where's the stream code?

The stream itself is hosted through AWS Elemental MediaLive so there's not actually any code to show there.

### Configuration
All configuration files (currently just one) for the site are stored in `ClientApp/src/config`

### Building
I have a super cool CI based build idea where the site is pushed to Netlify whilst the server is pushed to our dedicated server but I haven't actually done it yet lol.
idk `dotnet publish -c Release` might work
