using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class RemoveInspectionHeaderPictureInput
    {
        public string InspectionJobNumber { get; set; }
        public string PictureFileName { get; set; }
        public int PictureID { get; set; }
    }
}
