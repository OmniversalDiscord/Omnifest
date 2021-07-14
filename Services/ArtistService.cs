namespace Omnifest.Services
{
    public class ArtistService
    {
        private static string _currentArtist = "";

        public string getCurrentArtist()
        {
            return _currentArtist;
        }

        public void setCurrentArtist(string artist)
        {
            _currentArtist = artist;
        }
    }
}