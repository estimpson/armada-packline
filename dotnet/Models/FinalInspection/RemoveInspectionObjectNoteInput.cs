﻿namespace api.Models
{
    public class RemoveInspectionObjectNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public int Serial { get; set; }
        public int NoteID { get; set; }
    }
}
