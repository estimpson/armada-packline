using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using api.FxDatabase;
using api.Models;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("Login")]
        public ResultLogin Get([FromQuery] string user = "", [FromQuery] string password = "")
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
	e.operator_code = {user}
	and e.password = {password}
").ToArray()[0];
            }
            catch (Exception ex)
            {
                Response.StatusCode = 403;
                return null;
            }
        }

        [HttpGet("PartsWithPack")]
        public IEnumerable<Part> GetPartsWithPack()
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_PacklineParts"
            ).ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<Part>), new XmlRootAttribute("PartList"));
            var parts = (List<Part>) deserializer.Deserialize(
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
            var machines = (List<Machine>) deserializer.Deserialize(
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
            var partials = (List<Partial>) deserializer.Deserialize(
                new StringReader($"<PartialList>{result.Result}</PartialList>"));

            return partials;
        }

        [HttpGet("RecentPieceWeights")]
        public IEnumerable<RecentPieceWeight> GetRecentPieceWeights([FromQuery] string partCode="")
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
            var packingJobs = ((List<PackingJob>) deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

            return packingJobs;
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
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_Q_PackingJob_byJobNumber
    @PackingJobNumber = {packingJobNumber}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
            var packingJob = ((List<PackingJob>) deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

            return packingJob;
        }

        [HttpPost("GeneratePreObjects")]
        public IEnumerable<PackingJobObject> GeneratePreObjects([FromHeader] string user,
            [FromBody] GeneratePreObjectsInput input)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_GeneratePreObjects
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
,   @Boxes = {input.Boxes}
,   @PartialBoxQuantity = {input.PartialBoxQuantity}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<PackingJobObject>), new XmlRootAttribute("Result"));
            var packingJobObjects = (List<PackingJobObject>) deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"));

            return packingJobObjects;
        }

        [HttpPost("CancelPreObjects")]
        public IActionResult CancelPreObjects([FromHeader] string user, [FromBody] CancelPreObjects input)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_CancelPreObjects
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}").ToArray()[0];

            return Ok();
        }

        [HttpPost("CombinePreObject")]
        public IEnumerable<PackingJobObject> CombinePreObject([FromHeader] string user,
            [FromBody] CombinePreObjectInput input)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_CombinePreObject
    @User = {user}
,   @PackingJobNumber = {input.PackingJobNumber}
,   @CombineSerial = {input.CombineSerial}
").ToArray()[0];

            var deserializer = new XmlSerializer(typeof(List<PackingJobObject>), new XmlRootAttribute("Result"));
            var packingJobObjects = (List<PackingJobObject>) deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"));

            return packingJobObjects;
        }
    }
}