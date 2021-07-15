using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Omnifest.Controllers
{
    class SentryData
    {
        // All we care about is the DSN
        [JsonPropertyName("dsn")] public Uri DSN { get; set; }
    }
    
    [Route("tunnel")]
    // Proxy tunnel for sentry.io
    public class SentryController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public SentryController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }
        
        [HttpPost]
        public async Task<ActionResult> SentryTunnel()
        {
            // Sentry sends raw data so read the raw body
            if (!Request.Body.CanSeek)
            {
                // We only do this if the stream isn't *already* seekable,
                // as EnableBuffering will create a new stream instance
                // each time it's called
                Request.EnableBuffering();
            }
            
            // Read from start
            Request.Body.Position = 0;

            using var reader = new StreamReader(Request.Body, Encoding.UTF8);

            var body = await reader.ReadToEndAsync().ConfigureAwait(false);

            // Reset body position once we're done
            Request.Body.Position = 0;
            
            // We need the DSN from the first JSON chunk
            // Get the first JSON chunk to deserialize
            SentryData data;
            
            try
            {
                var chunk = body.Split("\n")[0]; 
                data = JsonSerializer.Deserialize<SentryData>(chunk);
            }
            catch (Exception e)
            {
                return new BadRequestResult();
            }

            // This shouldn't ever happen but it makes ReSharper happy
            if (data == null)
                return new BadRequestResult();

            var projectId = data.DSN.AbsolutePath.Trim('/');

            var client = _clientFactory.CreateClient();
            await client.PostAsync($"https://{data.DSN.Host}/api/{projectId}/envelope/",
                new StringContent(body));

            return new OkResult();
        }
    }
}