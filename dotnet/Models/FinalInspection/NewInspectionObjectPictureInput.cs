using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class NewInspectionObjectPictureInput
    {
        public string InspectionJobNumber { get; set; }
        public string PartCode { get; set; }
        public int Serial { get; set; }
        public string Base64Image { get; set; }
        public string Note { get; set; }
    }
}
