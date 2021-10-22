using System.ComponentModel.DataAnnotations;

namespace api.FxDatabase
{
    public enum DeflashMethod
    {
        MACHINE,
        TEARTRIM
    }

    public class PacklinePart
    {
        [Key]
        public string PartCode { get; set; }
        public string PartDescription { get; set; }
        public decimal UnitWeight { get; set; }
        public decimal WeightTolerance { get; set; }
        public decimal StandardPack { get; set; }
        public string SpecialInstructions { get; set; }
        public bool RequiresFinalInspection { get; set; }
        public DeflashMethod DeflashMethod { get; set; }
    }
}