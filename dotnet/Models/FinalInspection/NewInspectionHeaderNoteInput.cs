using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class NewInspectionHeaderNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public string Note { get; set; }
    }
}
