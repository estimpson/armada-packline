using System;
using api.FxDatabase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Security.Cryptography.X509Certificates;
using System.Xml;
using System.Xml.Serialization;
using api.Models;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FinalInspectionController : ControllerBase
    {
        private readonly ILogger<FinalInspectionController> _logger;
        private readonly FxContext _fxContext;

        public FinalInspectionController(ILogger<FinalInspectionController> logger, FxContext fxContext)
        {
            _logger = logger;
            _fxContext = fxContext;
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

        [HttpGet("CompletedPackingJobs")]
        public IEnumerable<PackingJob> GetCompletedPackingJobs()
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_Q_CompletedPackingJobs
").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<PackingJob>), new XmlRootAttribute("Result"));
                var packingJob = ((List<PackingJob>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>")));

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

        [HttpPost("UploadInspectionImage")]
        public InspectionImage UploadInspectionImage([FromBody] NewInspectionImageInput newInspectionImageInput)
        {
            try
            {
                var rowId = DateTime.Now.Ticks;

                var path = @$"C:\temp\";
                var imageName = $"{rowId}.jpg";
                var imagePath = Path.Combine(path, imageName);
                var imageBytes = Convert.FromBase64String(
                    newInspectionImageInput.Base64Image.Contains("data:image")
                        ? newInspectionImageInput.Base64Image.Substring(
                            newInspectionImageInput.Base64Image.LastIndexOf(',') + 1)
                        : newInspectionImageInput.Base64Image
                );
                using var fs = new FileStream(imagePath, FileMode.Create, FileAccess.Write, FileShare.Write,
                    imageBytes.Length);
                fs.Write(imageBytes, 0, imageBytes.Length);

                return new InspectionImage { LabelPath = imagePath, RowId = rowId };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPost("OpenInspectionJob")]
        public InspectionJob OpenInspectionJob([FromHeader] string user, [FromBody] NewInspectionJobInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_OpenInspectionJob
	@User = {user}
,	@PackingJobNumber = {input.PackingJobNumber}
").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<InspectionJob>), new XmlRootAttribute("Result"));
                var inspectionJob = ((List<InspectionJob>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>"))).ToArray()[0];

                return inspectionJob;
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