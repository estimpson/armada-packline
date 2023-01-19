using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionObject
    {
        [XmlAttribute]
        public string InspectionJobNumber { get; set; }
        [XmlAttribute]
        public int Serial { get; set; }
        [XmlAttribute]
        public string InspectionStatus { get; set; }
        [XmlAttribute]
        public decimal QuantityCompleted { get; set; }
        [XmlAttribute]
        public decimal QuantityAfterCombine { get; set; }
        [XmlAttribute]
        public bool Printed { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlElement]
        public List<InspectionObjectNote> Notes { get; set; }
        [XmlElement]
        public List<InspectionObjectPicture> Pictures { get; set; }
        [XmlElement]
        public List<InspectionCombine> Combines { get; set;}
    }
}
