using api.FxDatabase;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using SysFile = System.IO.File;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PrintController : ControllerBase
    {
        private readonly FxContext _fxContext;
        private readonly ILogger _logger;

        public PrintController(ILogger<PacklineController> logger, FxContext fxContext)
        {
            _logger = logger;
            _fxContext = fxContext;
        }

        [HttpPost("PrintPackingJobBT")]
        public PackingJob PrintPackingJobBT([FromHeader] string user, [FromQuery] string packingJobNumber)
        {
            var openedPackingJobObjects = OpenPackingJobObjectsForPrint(user, packingJobNumber);

            string bartenderPath;
            if (SysFile.Exists(@"c:\Program Files (x86)\Seagull\BarTender Suite\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender Suite\bartend.exe""";
            }
            else if (SysFile.Exists(@"c:\Program Files (x86)\Seagull\BarTender Suite 2021\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender Suite 2021\bartend.exe""";
            }
            else if (SysFile.Exists(@"c:\Program Files\Seagull\BarTender Suite\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files\Seagull\BarTender Suite\bartend.exe""";
            }
            else if (SysFile.Exists(@"c:\Program Files\Seagull\BarTender Suite 2021\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files\Seagull\BarTender Suite 2021\bartend.exe""";
            }
            else
            {
                throw new BadHttpRequestException("BarTender not found");
            }

            var serialList = string.Join(',', openedPackingJobObjects.Select(o => o.Serial.ToString()).ToArray());

            //foreach (var openedPackingJobObject in openedPackingJobObjects)
            //{

            var bartenderArgs = @$"/F=""{openedPackingJobObjects.First().LabelPath}"" /?Serial=""{serialList}"" /C={openedPackingJobObjects.First().Copies} /P /X";
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = bartenderPath,
                    Arguments = bartenderArgs
                }
            };
            process.Start();
            process.WaitForExit();
            //}

            var closedPackingJobObjects = ClosePackingJobPreObjectsAfterPrint(user, packingJobNumber, true);

            return closedPackingJobObjects;
        }

        [HttpPost("PrintSerialBT")]
        public PackingJobObject PrintSerialBT([FromQuery] string user, [FromQuery] long serial, [FromQuery] string labelPath, int copies)
        {
            var openedPackingJobObject = OpenPreObject(user, serial);

            string bartenderPath;
            if (SysFile.Exists(@"c:\Program Files (x86)\Seagull\BarTender Suite\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender Suite\bartend.exe""";
            }
            else if (SysFile.Exists(@"c:\Program Files (x86)\Seagull\BarTender Suite 2021\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender Suite 2021\bartend.exe""";
            }
            else if (SysFile.Exists(@"c:\Program Files\Seagull\BarTender Suite\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files\Seagull\BarTender Suite\bartend.exe""";
            }
            else if (SysFile.Exists(@"c:\Program Files\Seagull\BarTender Suite 2021\bartend.exe"))
            {
                bartenderPath = @"""c:\Program Files\Seagull\BarTender Suite 2021\bartend.exe""";
            }
            else
            {
                throw new BadHttpRequestException("BarTender not found");
            }
            var bartenderArgs = @$"/F=""{labelPath}"" /?Serial={openedPackingJobObject.Serial} /C={copies} /P /X";
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = bartenderPath,
                    Arguments = bartenderArgs
                }
            };
            process.Start();
            process.WaitForExit();

            var closedPackingJobObject = ClosePreObject(user, serial, true);

            return closedPackingJobObject;
        }

        private PackingJobObject OpenPreObject(string user, long serial)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_OpenPreObjectForPrint
    @User = {user}
,   @Serial = {serial}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<PackingJobObject>), new XmlRootAttribute("Result"));
            var packingJobObject = ((List<PackingJobObject>)deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

            return packingJobObject;
        }

        private PackingJobObject ClosePreObject(string user, long serial, bool printed)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
            $@"
execute FXPL.usp_CRUD_ClosePreObjectAfterPrint
    @User = {user}
,   @Serial = {serial}
,   @Printed = {(printed ? 1 : 0)}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<PackingJobObject>), new XmlRootAttribute("Result"));
            var packingJobObject = ((List<PackingJobObject>)deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

            return packingJobObject;
        }

        private IEnumerable<PackingJobObjectForPrint> OpenPackingJobObjectsForPrint(string user, string packingJobNumber)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated($@"
execute FXPL.usp_CRUD_OpenPackingJobPreObjectsForPrint
    @User = {user}
,   @PackingJobNumber = {packingJobNumber}
").ToArray()[0];


            var deserializer = new XmlSerializer(typeof(List<PackingJobObjectForPrint>), new XmlRootAttribute("Result"));
            var packingJobObjects = (List<PackingJobObjectForPrint>)deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"));

            return packingJobObjects;
        }

        private PackingJob ClosePackingJobPreObjectsAfterPrint(string user, string packingJobNumber, bool printed)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_ClosePackingJobPreObjectsAfterPrint
    @User = {user}
,   @PackingJobNumber = {packingJobNumber}
,   @Printed = {(printed ? 1 : 0)}
").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
                var packingJob = ((List<PackingJob>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

                return packingJob;
            }
            catch (SqlException e)
            {
                throw new Exception(e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}