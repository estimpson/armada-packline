using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class EditInspectionBulletinInput
    {
        public string PartCode { get; set; }
        public string NewNote { get; set; }
        public int BulletinID { get; set; }
    }
}
