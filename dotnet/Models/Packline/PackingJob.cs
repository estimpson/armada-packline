using System.Collections.Generic;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class PackingJob
    {
        [XmlAttribute]
        public string PackingJobNumber { get; set; }
        [XmlAttribute]
        public string PackingOperator { get; set; }
        [XmlAttribute]
        public string PartCode { get; set; }
        [XmlAttribute]
        public string PackagingCode { get; set; }
        [XmlAttribute]
        public string SpecialInstructions { get; set; }
        [XmlAttribute]
        public decimal PieceWeightQuantity { get; set; }
        [XmlAttribute]
        public decimal PieceWeight { get; set; }
        [XmlAttribute]
        public decimal PieceWeightTolerance { get; set; }
        [XmlAttribute]
        public bool PieceWeightValid { get; set; }
        [XmlAttribute]
        public string PieceWeightDiscrepancyNote { get; set; }
        [XmlAttribute]
        public string DeflashOperator { get; set; }
        [XmlAttribute]
        public string DeflashMachine { get; set; }
        [XmlAttribute]
        public int ShelfInventoryFlag { get; set; }
        [XmlAttribute]
        public int PreviousJobShelfInventoryFlag { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlElement]
        public List<PackingJobObject> Objects { get; set; }
    }
}
