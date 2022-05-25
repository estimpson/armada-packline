using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public Part Part { get; set; }
        [XmlAttribute]
        public Packaging Packaging { get; set; }
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
        public bool ShelfInventoryFlag { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlElement]
        public List<PackingJobObject> ObjectList { get; set; }

    }
}
