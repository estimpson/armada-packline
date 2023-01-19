using System;
using api.FxDatabase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using api.Models;
using Microsoft.Data.SqlClient;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FinalInspectionController : ControllerBase
    {
        const string _pictureFolderRoot = @"X:\Fx\Pictures";
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
        public IEnumerable<CompletedPackingJob> GetCompletedPackingJobs()
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_Q_CompletedPackingJobs
").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<CompletedPackingJob>), new XmlRootAttribute("Result"));
                var packingJobList = ((List<CompletedPackingJob>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>")));

                return packingJobList;
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

        [HttpGet("InspectionJob")]
        public InspectionJob GetInspectionJob([FromHeader] string user, [FromQuery] string inspectionJobNumber)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_Q_InspectionJob_byJobNumber
	@InspectionJobNumber = {inspectionJobNumber}
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

        [HttpGet("InspectionImageData")]
        public IEnumerable<InspectionImageData> GetInspectionImageData([FromHeader] string user, [FromQuery] string pictureFileGUIDList)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_Q_InspectionImageData_byPictureFileGUIDList
	@PictureFileGUIDList = {pictureFileGUIDList}
").ToArray()[0];

                var deserializer = new XmlSerializer(typeof(List<InspectionImageData>), new XmlRootAttribute("Result"));
                var inspectionImageDataList = ((List<InspectionImageData>)deserializer.Deserialize(
                    new StringReader($"<Result>{result.Result}</Result>")));

                return inspectionImageDataList;
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

        [HttpPost("OpenInspectionJob")]
        public InspectionJob OpenInspectionJob([FromHeader] string user, [FromBody] NewInspectionJobInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_Open
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

        [HttpPost("FinalizeInspectionJob")]
        public InspectionJob FinalizeInspectionJob([FromHeader] string user, [FromBody] FinalizeInspectionJobInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_Finalize
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
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

        [HttpPost("SetHeaderInspectionStatus")]
        public InspectionJob SetHeaderInspectionStatus([FromHeader] string user, [FromBody] SetHeaderInspectionStatusInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_SetHeaderInspectionStatus
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @InspectionStatus = {input.InspectionStatus}
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

        [HttpPost("SetObjectInspectionStatus")]
        public InspectionJob SetObjectInspectionStatus([FromHeader] string user, [FromBody] SetObjectInspectionStatusInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_SetObjectInspectionStatus
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @InspectionStatus = {input.InspectionStatus}
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

        [HttpPost("AddBulletin")]
        public IActionResult AddBulletin([FromHeader] string user, [FromBody] NewInspectionBulletinInput input)
        {
            try
            {
                var pictureFileName = string.Empty;
                if (input.Base64Image?.Length > 0)
                {
                    var partPath = Path.Join(_pictureFolderRoot, input.PartCode);
                    if (!Directory.Exists(partPath))
                    {
                        Directory.CreateDirectory(partPath);
                    }
                    var jobPictureFiles = Directory.GetFiles(partPath, "Bulletin!*");
                    int nextSuffix = 0;
                    foreach (var jobPictureFile in jobPictureFiles)
                    {
                        if (int.TryParse(jobPictureFile.Split('!')[1].Split('.')[0], out int suffix))
                        {
                            nextSuffix = suffix >= nextSuffix ? suffix + 1 : nextSuffix;
                        }
                    }
                    pictureFileName = Path.Join(partPath, $"Bulletin!{nextSuffix:000}.jpg");
                    var imageBytes = Convert.FromBase64String(
                        input.Base64Image.Contains("data:image")
                            ? input.Base64Image.Substring(
                                input.Base64Image.LastIndexOf(',') + 1)
                            : input.Base64Image
                    );
                    using var fs = new FileStream(pictureFileName, FileMode.Create, FileAccess.Write, FileShare.Write,
                        imageBytes.Length);
                    fs.Write(imageBytes, 0, imageBytes.Length);
                }

                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_Inspection_AddBulletin
	@User = {user}
,	@PartCode = {input.PartCode}
,   @Base64Image = {input.Base64Image}
,   @PictureFileName = {pictureFileName}
,   @Note = {input.Note}
").ToArray()[0];

                return Ok();
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

        [HttpPost("EditBulletin")]
        public IActionResult EditHeaderNote([FromHeader] string user, [FromBody] EditInspectionBulletinInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_Inspection_EditBulletin
	@User = {user}
,	@PartCode = {input.PartCode}
,   @NewNote = {input.NewNote}
,   @BulletinID = {input.BulletinID}
").ToArray()[0];

                return Ok();
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

        [HttpPost("RemoveBulletin")]
        public IActionResult RemoveBulletin ([FromHeader] string user, [FromBody] RemoveInspectionBulletinInput input)
        {
            try
            {
                if (System.IO.File.Exists(input.PictureFileName))
                {
                    System.IO.File.Delete(input.PictureFileName);
                }

                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_Inspection_CancelBulletin
	@User = {user}
,	@PartCode = {input.PartCode}
,   @BulletinID = {input.BulletinID}
").ToArray()[0];

                return Ok();
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

        [HttpPost("AddHeaderNote")]
        public InspectionJob AddHeaderNote([FromHeader] string user, [FromBody] NewInspectionHeaderNoteInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_AddHeaderNote
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Note = {input.Note}
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

        [HttpPost("EditHeaderNote")]
        public InspectionJob EditHeaderNote([FromHeader] string user, [FromBody] EditInspectionHeaderNoteInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_EditHeaderNote
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @NewNote = {input.NewNote}
,   @NoteID = {input.NoteID}
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

        [HttpPost("RemoveHeaderNote")]
        public InspectionJob RemoveHeaderNote([FromHeader] string user, [FromBody] RemoveInspectionHeaderNoteInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_CancelHeaderNote
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @NoteID = {input.NoteID}
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

        [HttpPost("AddObjectNote")]
        public InspectionJob AddObjectNote([FromHeader] string user, [FromBody] NewInspectionObjectNoteInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_AddObjectNote
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @Note = {input.Note}
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

        [HttpPost("EditObjectNote")]
        public InspectionJob EditObjectNote([FromHeader] string user, [FromBody] EditInspectionObjectNoteInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_EditOjectNote
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @NewNote = {input.NewNote}
,   @NoteID = {input.NoteID}
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

        [HttpPost("RemoveObjectNote")]
        public InspectionJob RemoveObjectNote([FromHeader] string user, [FromBody] RemoveInspectionObjectNoteInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_CancelObjectNote
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @NoteID = {input.NoteID}
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

        [HttpPost("AddHeaderPicture")]
        public InspectionJob AddHeaderPicture([FromHeader] string user, [FromBody] NewInspectionHeaderPictureInput input)
        {
            try
            {
                var partPath = Path.Join(_pictureFolderRoot, input.PartCode);
                if (!Directory.Exists(partPath))
                {
                    Directory.CreateDirectory(partPath);
                }
                var jobPictureFiles = Directory.GetFiles(partPath, $"{input.InspectionJobNumber}!*");
                int nextSuffix = 0;
                foreach (var jobPictureFile in jobPictureFiles)
                {
                    if (int.TryParse(jobPictureFile.Split('!')[1].Split('.')[0], out int suffix))
                    {
                        nextSuffix = suffix >= nextSuffix ? suffix + 1 : nextSuffix;
                    }
                }
                var pictureFileName = Path.Join(partPath, $"{input.InspectionJobNumber}!{nextSuffix:000}.jpg");
                var imageBytes = Convert.FromBase64String(
                    input.Base64Image.Contains("data:image")
                        ? input.Base64Image.Substring(
                            input.Base64Image.LastIndexOf(',') + 1)
                        : input.Base64Image
                );
                using var fs = new FileStream(pictureFileName, FileMode.Create, FileAccess.Write, FileShare.Write,
                    imageBytes.Length);
                fs.Write(imageBytes, 0, imageBytes.Length);

                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_AddHeaderPicture
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Base64Image = {input.Base64Image}
,   @PictureFileName = {pictureFileName}
,   @Note = {input.Note}
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

        [HttpPost("EditHeaderPicture")]
        public InspectionJob EditHeaderPicture([FromHeader] string user, [FromBody] EditInspectionHeaderPictureInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_EditHeaderPicture
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @NewNote = {input.NewNote}
,   @PictureID = {input.PictureID}
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

        [HttpPost("RemoveHeaderPicture")]
        public InspectionJob RemoveHeaderPicture([FromHeader] string user, [FromBody] RemoveInspectionHeaderPictureInput input)
        {
            try
            {
                if (System.IO.File.Exists(input.PictureFileName))
                {
                    System.IO.File.Delete(input.PictureFileName);
                }

                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_CancelHeaderPicture
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @PictureID = {input.PictureID}
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

        [HttpPost("AddObjectPicture")]
        public InspectionJob AddObjectPicture([FromHeader] string user, [FromBody] NewInspectionObjectPictureInput input)
        {
            try
            {
                var partPath = Path.Join(_pictureFolderRoot, input.PartCode);
                if (!Directory.Exists(partPath))
                {
                    Directory.CreateDirectory(partPath);
                }
                var objectPictureFiles = Directory.GetFiles(partPath, $"{input.Serial}!*");
                int nextSuffix = 0;
                foreach (var objectPictureFile in objectPictureFiles)
                {
                    if (int.TryParse(objectPictureFile.Split('!')[1].Split('.')[0], out int suffix))
                    {
                        nextSuffix = suffix >= nextSuffix ? suffix + 1 : nextSuffix;
                    }
                }
                var pictureFileName = Path.Join(partPath, $"{input.Serial}!{nextSuffix:000}.jpg");
                var imageBytes = Convert.FromBase64String(
                    input.Base64Image.Contains("data:image")
                        ? input.Base64Image.Substring(
                            input.Base64Image.LastIndexOf(',') + 1)
                        : input.Base64Image
                );
                using var fs = new FileStream(pictureFileName, FileMode.Create, FileAccess.Write, FileShare.Write,
                    imageBytes.Length);
                fs.Write(imageBytes, 0, imageBytes.Length);

                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_AddObjectPicture
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @Base64Image = {input.Base64Image}
,   @PictureFileName = {pictureFileName}
,   @Note = {input.Note}
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

        [HttpPost("EditObjectPicture")]
        public InspectionJob EditHeaderPicture([FromHeader] string user, [FromBody] EditInspectionObjectPictureInput input)
        {
            try
            {
                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_EditObjectPicture
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @NewNote = {input.NewNote}
,   @PictureID = {input.PictureID}
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

        [HttpPost("RemoveObjectPicture")]
        public InspectionJob RemoveObjectPicture([FromHeader] string user, [FromBody] RemoveInspectionObjectPictureInput input)
        {
            try
            {
                if (System.IO.File.Exists(input.PictureFileName))
                {
                    System.IO.File.Delete(input.PictureFileName);
                }

                var result = _fxContext.XmlResults.FromSqlInterpolated(
                $@"
execute FXFI.usp_CRUD_InspectionJob_CancelObjectPicture
	@User = {user}
,	@InspectionJobNumber = {input.InspectionJobNumber}
,   @Serial = {input.Serial}
,   @PictureID = {input.PictureID}
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