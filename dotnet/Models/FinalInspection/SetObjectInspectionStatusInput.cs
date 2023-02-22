namespace api.Models
{
    public class SetObjectInspectionStatusInput
    {
        public string InspectionJobNumber { get; set; }
        public int Serial { get; set; }
        public string InspectionStatus { get; set; }
    }
}
