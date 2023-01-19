using System;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionBulletin
    {
        [XmlAttribute]
        public string PartCode { get; set; }
        [XmlAttribute]
        public Guid PictureFileGUID { get; set; }
        [XmlAttribute]
        public string PictureFileName { get; set; }
        [XmlAttribute]
        public string Note { get; set; }
        [XmlAttribute]
        public string CreatedByOperator { get; set; }
        [XmlAttribute]
        public DateTime CreateDT { get; set; }
        [XmlAttribute]
        public int BulletinID { get; set; }
    }
}