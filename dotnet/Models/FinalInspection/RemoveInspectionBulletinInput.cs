using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class RemoveInspectionBulletinInput
    {
        public string PartCode { get; set; }
        public string PictureFileName { get; set; }
        public int BulletinID { get; set; }
    }
}
