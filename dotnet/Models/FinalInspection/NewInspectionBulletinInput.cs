using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class NewInspectionBulletinInput
    {
        public string PartCode { get; set; }
        public string Base64Image { get; set; }
        public string Note { get; set; }
    }
}
