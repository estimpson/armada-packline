namespace api.Models
{
    public class GeneratePreObjectsInput
    {
        public string PackingJobNumber { get; set; }
        public int Boxes { get; set; }
        public decimal PartialBoxQuantity { get; set; }
    }
}
