using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class PackingJobObject
    {
        [XmlAttribute]
        public string PackingJobNumber { get; set; }
        [XmlAttribute]
        public long Serial { get; set; }
        [XmlAttribute]
        public decimal Quantity { get; set; }
        [XmlAttribute]
        public bool Printed { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlElement]
        public List<PackingJobCombine> Combines { get; set; }
    }
}
