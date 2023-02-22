namespace api.Models
{
    public class RemoveInspectionHeaderPictureInput
    {
        public string InspectionJobNumber { get; set; }
        public string PictureFileName { get; set; }
        public int PictureID { get; set; }
    }
}
