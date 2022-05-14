using System.Collections.Generic;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class PackingJobObjectForPrint
    {
        [XmlAttribute] public string PackingJobNumber { get; set; }

        [XmlAttribute] public long Serial { get; set; }

        [XmlAttribute] public decimal Quantity { get; set; }

        [XmlAttribute] public bool Printed { get; set; }

        [XmlAttribute] public string LabelPath { get; set; }
        
        [XmlAttribute] public int Copies { get; set; }

        [XmlAttribute] public int RowID { get; set; }
    }
}