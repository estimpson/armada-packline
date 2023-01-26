using System.Collections.Generic;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionJob
    {
        [XmlAttribute]        
        public string InspectionJobNumber { get; set; }
        [XmlAttribute]
        public string InspectionOperator { get; set; }
        [XmlAttribute]
        public string InspectionStatus { get; set; }
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
        public bool JobDoneFlag { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlAttribute]
        public string PackingDT { get; set; }
        [XmlElement]
        public InspectionPart Part { get; set; }
        [XmlElement]
        public PartPackaging PartPackaging { get; set; }
        [XmlElement]
        public List<InspectionHeaderNote> Notes { get; set; }
        [XmlElement]
        public List<InspectionHeaderPicture> Pictures { get; set; }
        [XmlElement]
        public List<InspectionObject> Objects { get; set; }
        [XmlElement]
        public List<InspectionBulletin> Bulletins { get; set; }
        [XmlElement]
        public List<InspectionPriorLot> PriorLots { get; set; }

    }
}
