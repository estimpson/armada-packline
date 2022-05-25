using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using api.FxDatabase;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PacklineController : ControllerBase
    {
        private readonly FxContext _fxContext;
        private readonly ILogger<PacklineController> _logger;

        public PacklineController(ILogger<PacklineController> logger, FxContext fxContext)
        {
            _logger = logger;
            _fxContext = fxContext;
        }

        [HttpGet("PartsWithPack")]
        public IEnumerable<Part> GetPartsWithPack()
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_PacklineParts"
            ).ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<Part>), new XmlRootAttribute("PartList"));
            var parts = (List<Part>)deserializer.Deserialize(
                new StringReader($"<PartList>{result.Result}</PartList>"));

            return parts;
        }

        [HttpGet("Machines")]
        public IEnumerable<Machine> GetMachines()
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_Machines").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<Machine>), new XmlRootAttribute("MachineList"));
            var machines = (List<Machine>)deserializer.Deserialize(
                new StringReader($"<MachineList>{result.Result}</MachineList>"));

            return machines;
        }

        [HttpGet("Partials")]
        public IEnumerable<Partial> GetPartials([FromQuery] string partCode = "")
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_Partials_byPart
    @PartCode = {partCode}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<Partial>), new XmlRootAttribute("PartialList"));
            var partials = (List<Partial>)deserializer.Deserialize(
                new StringReader($"<PartialList>{result.Result}</PartialList>"));

            return partials;
        }

        [HttpGet("RecentPieceWeights")]
        public IEnumerable<RecentPieceWeight> GetRecentPieceWeights([FromQuery] string partCode = "")
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_PreviousPiecesWeights_byPart
    @PartCode = {partCode}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<RecentPieceWeight>), new XmlRootAttribute("RecentPieceWeightList"));
            var recentPieceWeight = (List<RecentPieceWeight>)deserializer.Deserialize(
                new StringReader($"<RecentPieceWeightList>{result.Result}</RecentPieceWeightList>"));

            return recentPieceWeight;
        }

        [HttpPost("OpenPackingJob")]
        public PackingJob OpenPackingJob([FromHeader] string user, [FromBody] NewPackingJobInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_OpenPackingJob
	@User = {user}
,	@PartCode = {input.PartCode}
,	@PackagingCode = {input.PackagingCode}
,   @StandardPack = {input.StandardPack}
,	@SpecialInstructions = {input.SpecialInstructions}
,	@PieceWeightQuantity = {input.PieceWeightQuantity}
,	@PieceWeight = {input.PieceWeight}
,	@PieceWeightTolerance = {input.PieceWeightTolerance}
,	@PieceWeightValid = {input.PieceWeightValid}
,	@PieceWeightDiscrepancyNote = {input.PieceWeightDiscrepancyNote}
,	@DeflashOperator = {input.DeflashOperator}
,	@DeflashMachine = {input.DeflashMachine}
").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
                var packingJobs = ((List<PackingJob>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

                return packingJobs;
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

        [HttpPost("CancelPackingJob")]
        public IActionResult CancelPackingJob([FromHeader] string user, [FromBody] CancelPackingJob cancelPackingJob)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_CancelPackingJob
    @User = {user}
,   @PackingJobNumber = {cancelPackingJob.PackingJobNumber}").ToArray()[0];

            return Ok();
        }

        [HttpGet("PackingJob")]
        public PackingJob GetPackingJob([FromQuery] string packingJobNumber = "")
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_PackingJob_byJobNumber
    @PackingJobNumber = {packingJobNumber}
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

        [HttpPost("GeneratePreObjects")]
        public PackingJob GeneratePreObjects([FromHeader] string user,
            [FromBody] GeneratePreObjectsInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_GeneratePreObjects
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
,   @Boxes = {input.Boxes}
,   @PartialBoxQuantity = {input.PartialBoxQuantity}
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

        [HttpPost("CancelPreObjects")]
        public PackingJob CancelPreObjects([FromHeader] string user, [FromBody] CancelPreObjects input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                    $@"
execute FXPL.usp_CRUD_CancelPreObjects
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
                var packingJobs = ((List<PackingJob>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

                return packingJobs;
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

        [HttpPost("CombinePreObject")]
        public PackingJob CombinePreObject([FromHeader] string user,
            [FromBody] CombinePreObjectInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                    $@"
execute FXPL.usp_CRUD_CombinePreObject
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
,   @CombineSerial = {input.CombineSerial}
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

        [HttpPost("PrintPackingJobBT")]
        public PackingJob PrintPackingJobBT([FromHeader] string user, [FromBody] PackingJobInput input)
        {
            List<PackingJobObjectForPrint> openedPackingJobObjects;
            try
            {
                var openResult = _fxContext.XmlResults.FromSqlInterpolated($@"
execute FXPL.usp_CRUD_OpenPackingJobPreObjectsForPrint
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
").ToArray()[0];

                var deserializer1 = new XmlSerializer(typeof(List<PackingJobObjectForPrint>), new XmlRootAttribute("Result"));
                openedPackingJobObjects = (List<PackingJobObjectForPrint>)deserializer1.Deserialize(
                    new StringReader($"<Result>{openResult.Result}</Result>"));
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

            bool printingFailed = false;
            string printFailureMessage = "";
            try
            {
                string bartenderPath;
                if (System.IO.File.Exists(@"c:\Program Files (x86)\Seagull\BarTender Suite\bartend.exe"))
                {
                    bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender Suite\bartend.exe""";
                }
                else if (System.IO.File.Exists(@"c:\Program Files (x86)\Seagull\BarTender Suite 2021\bartend.exe"))
                {
                    bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender Suite 2021\bartend.exe""";
                }
                else if (System.IO.File.Exists(@"c:\Program Files\Seagull\BarTender Suite\bartend.exe"))
                {
                    bartenderPath = @"""c:\Program Files\Seagull\BarTender Suite\bartend.exe""";
                }
                else if (System.IO.File.Exists(@"c:\Program Files\Seagull\BarTender Suite 2021\bartend.exe"))
                {
                    bartenderPath = @"""c:\Program Files\Seagull\BarTender Suite 2021\bartend.exe""";
                }
                else if (System.IO.File.Exists(@"c:\Program Files (x86)\Seagull\BarTender 2021\bartend.exe"))
                {
                    bartenderPath = @"""c:\Program Files (x86)\Seagull\BarTender 2021\bartend.exe""";
                }
                else if (System.IO.File.Exists(@"c:\Program Files\Seagull\BarTender 2021\bartend.exe"))
                {
                    bartenderPath = @"""c:\Program Files\Seagull\BarTender 2021\bartend.exe""";
                }
                else
                {
                    throw new BadHttpRequestException("BarTender not found");
                }

                foreach (var openedPackingJobObject in openedPackingJobObjects)
                {
                    var bartenderArgs =
                        @$"/F=""{openedPackingJobObject.LabelPath}"" /?Serial={openedPackingJobObject.Serial} /C={openedPackingJobObject.Copies} /P /X";
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
                }
            }
            catch (SqlException e)
            {
                printingFailed = true;
                printFailureMessage = e.Message;
            }
            catch (Exception e)
            {
                printingFailed = true;
                printFailureMessage = e.Message;
            }

            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                    $@"
execute FXPL.usp_CRUD_ClosePackingJobPreObjectsAfterPrint
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
,   @Printed = {(printingFailed ? '0' : '1')}
").ToArray()[0];

                var deserializer2 = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
                var packingJob = ((List<PackingJob>)deserializer2.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

                if (printingFailed)
                {
                    throw new Exception($"Printing failed: {printFailureMessage}");
                }
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

        [HttpPost("CompletePackingJob")]
        public PackingJob CompletePackingJob([FromHeader] string user, [FromBody] CompletePackingJobInput input)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_PackingJob_Complete
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
,   @ShelfInventoryFlag = {input.ShelfInventoryFlag}
,   @JobDoneFlag = {input.JobDoneFlag}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
            var packingJob = ((List<PackingJob>)deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

            return packingJob;
        }
    }
}