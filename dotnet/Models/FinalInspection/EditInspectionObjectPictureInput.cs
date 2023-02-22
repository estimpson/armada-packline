namespace api.Models
{
    public class EditInspectionObjectPictureInput
    {
        public string InspectionJobNumber { get; set; }
        public int Serial { get; set; }
        public string NewNote { get; set; }
        public string PictureFileName { get; set; }
        public int PictureID { get; set; }
    }
}
