namespace api.Models
{
    public class RemoveInspectionObjectPictureInput
    {
        public string InspectionJobNumber { get; set; }
        public int Serial { get; set; }
        public string PictureFileName { get; set; }
        public int PictureID { get; set; }
    }
}
