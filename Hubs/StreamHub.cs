#nullable enable
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Omnifest.Services;

namespace Omnifest.Hubs
{
    public class StreamHub : Hub
    {
        private ArtistService _artistService;
        private ViewerCountService _viewerCountService;

        public StreamHub(ArtistService artistService, ViewerCountService viewerCountService)
        {
            _viewerCountService = viewerCountService;
            _artistService = artistService;
        }
        
        public override async Task OnConnectedAsync()
        {
            var count = _viewerCountService.getViewers() + 1;
            _viewerCountService.setViewers(count);
            await Clients.All.SendAsync("UpdateViewCount", count);
            await Clients.All.SendAsync("UpdateArtist", _artistService.getCurrentArtist());
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var count = _viewerCountService.getViewers() - 1;
            _viewerCountService.setViewers(count);
            await Clients.All.SendAsync("UpdateViewCount", count);
            await base.OnDisconnectedAsync(exception);
        }
    }
}