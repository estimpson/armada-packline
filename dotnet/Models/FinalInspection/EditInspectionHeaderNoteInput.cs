using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class EditInspectionHeaderNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public string NewNote { get; set; }
        public int NoteID { get; set; }
    }
}
