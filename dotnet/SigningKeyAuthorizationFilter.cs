using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;

namespace api
{
    internal class SigningKeyAuthorizationFilter : Attribute, IAuthorizationFilter
    {
        private IConfiguration _configuration;

        public SigningKeyAuthorizationFilter(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var appSigningKey = _configuration.GetValue<string>("signingkey") ?? "devKey";
            var signingKey = string.Empty;
            if (context.HttpContext.Request.Headers.ContainsKey("x-signing-key"))
            {
                if (context.HttpContext.Request.Headers.TryGetValue("x-signing-key", out var signingKeysStringValues))
                {
                    signingKey = signingKeysStringValues.FirstOrDefault();
                };
            }

            if (signingKey != appSigningKey)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
