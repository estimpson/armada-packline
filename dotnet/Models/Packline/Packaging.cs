using System.Xml.Serialization;

namespace api.Models
{
    public class Packaging
    {
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