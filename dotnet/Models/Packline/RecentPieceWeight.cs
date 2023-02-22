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
