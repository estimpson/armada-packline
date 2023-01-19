using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class RemoveInspectionHeaderNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public int NoteID { get; set; }
    }
}
