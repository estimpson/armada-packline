using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionCombine
    {
        [XmlAttribute]
        public string PackingJobNumber { get; set; }
        [XmlAttribute]
        public long FromSerial { get; set; }
        [XmlAttribute]
        public decimal FromOriginalQuantity { get; set; }
        [XmlAttribute]
        public decimal FromNewQuantity { get; set; }
        [XmlAttribute]
        public bool FromReprint { get; set; }
        [XmlAttribute]
        public long ToSerial { get; set; }
        [XmlAttribute]
        public decimal ToOriginalQuantity { get; set; }
        [XmlAttribute]
        public decimal ToNewQuantity { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlElement]
        public List<InspectionObjectNote> Notes { get; set; }
        [XmlElement]
        public List<InspectionObjectPicture> Pictures { get; set; }
    }
}
