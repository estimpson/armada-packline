namespace api.Models
{
    public class EditInspectionHeaderNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public string NewNote { get; set; }
        public int NoteID { get; set; }
    }
}
