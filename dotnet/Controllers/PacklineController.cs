using System;
using api.FxDatabase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Xml;
using System.Xml.Serialization;
using api.Models;
using Newtonsoft.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PacklineController : ControllerBase
    {
        private readonly ILogger<PacklineController> _logger;
        private readonly FxContext _fxContext;

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
            var partials = (List<Partial>) deserializer.Deserialize(
                new StringReader($"<PartialList>{result.Result}</PartialList>"));

            return partials;
        }

        [HttpPost("OpenPackingJob")]
        public PackingJob OpenPackingJob([FromHeader] string user, [FromBody] NewPackingJobInput newPackingJobInput)
        {
            var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXPL.usp_CRUD_OpenPackingJob
	@User = {user}
,	@PartCode = {newPackingJobInput.PartCode}
,	@PackagingCode = {newPackingJobInput.PackagingCode}
,	@SpecialInstructions = {newPackingJobInput.SpecialInstructions}
,	@PieceWeightQuantity = {newPackingJobInput.PieceWeightQuantity}
,	@PieceWeight = {newPackingJobInput.PieceWeight}
,	@PieceWeightTolerance = {newPackingJobInput.PieceWeightTolerance}
,	@PieceWeightValid = {newPackingJobInput.PieceWeightValid}
,	@PieceWeightDiscrepancyNote = {newPackingJobInput.PieceWeightDiscrepancyNote}
,	@DeflashOperator = {newPackingJobInput.DeflashOperator}
,	@DeflashMachine = {newPackingJobInput.DeflashMachine}
").ToArray()[0];


            var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
            var x = ((List<PackingJob>) deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>")));
            var packingJob = ((List<PackingJob>)deserializer.Deserialize(
                new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

            return packingJob;
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
    }
}