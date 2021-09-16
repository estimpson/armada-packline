using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    //[TypeFilter(typeof(SigningKeyAuthorizationFilter))]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly string _appSigningKey;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IConfiguration configuration)
        {
            _logger = logger;
           _appSigningKey = configuration.GetValue<string>("signingkey");
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var signingKey = string.Empty;
            if (Request.Headers.ContainsKey("x-signing-key"))
            {
                if (Request.Headers.TryGetValue("x-signing-key", out var signingKeysStringValues))
                {
                    signingKey = signingKeysStringValues.FirstOrDefault();
                };
            }

            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)] + $":{signingKey}"
            })
            .ToArray();
        }
    }
}
