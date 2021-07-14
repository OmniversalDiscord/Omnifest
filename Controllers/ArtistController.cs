using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Omnifest.Hubs;
using Omnifest.Services;

namespace Omnifest.Controllers
{
    [Route("artist")]
    public class ArtistController : Controller
    {
        private ArtistService _artistService;
        private IHubContext<StreamHub> _streamHub;

        public ArtistController(ArtistService artistService, IHubContext<StreamHub> streamHub)
        {
            _artistService = artistService;
            _streamHub = streamHub;
        }
        
        // GET
        [HttpPost]
        public async Task<ActionResult<string>> SetArtist(string artist)
        {
            _artistService.setCurrentArtist(artist);
            await _streamHub.Clients.All.SendAsync("UpdateArtist", artist);
            return "Artist updated successfully";
        }
    }
}