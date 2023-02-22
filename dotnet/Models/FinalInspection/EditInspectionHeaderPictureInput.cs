namespace api.Models
{
    public class EditInspectionHeaderPictureInput
    {
        public string InspectionJobNumber { get; set; }
        public string PictureFileName { get; set; }
        public string NewBase64Image { get; set; }
        public string NewNote { get; set; }
        public int PictureID { get; set; }
    }
}
