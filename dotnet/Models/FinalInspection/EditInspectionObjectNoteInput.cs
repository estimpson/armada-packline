﻿namespace api.Models
{
    public class EditInspectionObjectNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public int Serial { get; set; }
        public string NewNote { get; set; }
        public int NoteID { get; set; }
    }
}
