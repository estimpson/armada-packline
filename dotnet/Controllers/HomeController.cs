using api.FxDatabase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly FxContext _fxContext;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, FxContext fxContext)
        {
            _logger = logger;
            _fxContext = fxContext;
        }

        [HttpGet("Ping")]
        public IActionResult Ping()
        {
            return Ok();
        }

        [HttpGet("Login")]
        public ResultLogin Get([FromQuery] string password = "")
        {
            try
            {
                return _fxContext.ResultLogins.FromSqlInterpolated($@"
select
	[user] = e.operator_code
,	name = e.name
from
	dbo.employee e
where
	e.password = {password}
").ToArray()[0];
            }
            catch
            {
                Response.StatusCode = 403;
                return null;
            }
        }
    }
}