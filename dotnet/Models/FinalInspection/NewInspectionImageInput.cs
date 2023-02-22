namespace api.Models
{
    public class NewInspectionImageInput
    {
        public string Base64Image { get; set; }
        public string Part { get; set; }
        public string PackingJobNumber { get; set; }
    }
}
