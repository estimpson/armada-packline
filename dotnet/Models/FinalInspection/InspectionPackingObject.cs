﻿using System.Collections.Generic;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionPackingObject
    {
        [XmlAttribute]
        public string PackingJobNumber { get; set; }
        [XmlAttribute]
        public int Serial { get; set; }
        [XmlAttribute]
        public decimal QuantityCompleted { get; set; }
        [XmlAttribute]
        public decimal QuantityAfterCombine { get; set; }
        [XmlAttribute]
        public bool Printed { get; set; }
        [XmlAttribute]
        public int RowID { get; set; }
        [XmlElement]
        public List<InspectionCombine> Combines { get; set; }
    }
}
