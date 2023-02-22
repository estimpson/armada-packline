using System;
using System.Xml.Serialization;

namespace api.Models
{
    public class Partial
    {
        [XmlAttribute]
        public int Serial { get; set; }
        [XmlAttribute]
        public string PackageType { get; set; }
        [XmlAttribute]
        public decimal Quantity { get; set; }
        [XmlAttribute]
        public string Notes { get; set; }
        [XmlAttribute]
        public DateTime LastDate { get; set; }
    }
}
