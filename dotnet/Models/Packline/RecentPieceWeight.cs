using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class RecentPieceWeight
    {
        [XmlAttribute] public decimal PieceWeight { get; set; }
        [XmlAttribute] public int RowID { get; set; }
    }
}
