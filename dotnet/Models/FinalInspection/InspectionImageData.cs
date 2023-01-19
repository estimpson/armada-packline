using System;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionImageData
    {
        [XmlAttribute]
        public Guid PictureFileGUID { get; set; }
        [XmlAttribute]
        public string Base64Image { get; set; }
    }
}
