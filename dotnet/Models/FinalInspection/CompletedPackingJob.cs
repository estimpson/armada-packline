using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class CompletedPackingJob
    {
        [XmlAttribute]
        public string PackingJobNumber { get; set; }
        [XmlAttribute]
        public string PackingOperator { get; set; }
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
        public string DeflashMachineCode { get; set; }
        [XmlAttribute]
        public int CompleteBoxes { get; set; }
        [XmlAttribute]
        public decimal PartialBoxQuantity { get; set; }
        [XmlAttribute]
        public bool ShelfInventoryFlag { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlAttribute]
        public string PackingDT { get; set; }
        [XmlElement]
        public InspectionPart Part { get; set; }
        [XmlElement]
        public PartPackaging PartPackaging { get; set; }
        [XmlElement]
        public List<InspectionPackingObject> Objects { get; set; }
    }
}
