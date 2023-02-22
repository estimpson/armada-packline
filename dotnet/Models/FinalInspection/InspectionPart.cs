using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionPart
    {
        [XmlAttribute]
        public string PartCode { get; set; }
        [XmlAttribute]
        public string PartDescription { get; set; }
        [XmlAttribute]
        public decimal UnitWeight { get; set; }
        [XmlAttribute]
        public decimal WeightTolerance { get; set; }
        [XmlAttribute]
        public string DefaultPackagingCode { get; set; }
        [XmlAttribute]
        public bool RequiredFinalInspection { get; set; }
        [XmlAttribute]
        public string DeflashMethod { get; set; }
    }
}
