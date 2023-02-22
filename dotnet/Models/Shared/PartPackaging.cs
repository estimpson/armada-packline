using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class PartPackaging
    {
        [XmlAttribute]
        public string PartCode { get; set; }
        [XmlAttribute]
        public string PackageCode { get; set; }
        [XmlAttribute]
        public string PackageDescription { get; set; }
        [XmlAttribute]
        public decimal StandardPack { get; set; }
        [XmlAttribute]
        public string SpecialInstructions { get; set; }
    }
}
