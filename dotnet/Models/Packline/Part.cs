﻿using System;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class Part
    {
        [XmlAttribute]
        public string PartCode { get; set; }
        [XmlAttribute]
        public string PartDescription { get; set; }
        [XmlAttribute]
        public decimal UnitWeight { get; set; }
        [XmlAttribute]
        public decimal WeightTolerance { get; set; }
        [XmlAttribute]
        public Boolean RequiresFinalInspection { get; set; }
        [XmlAttribute]
        public string DeflashMethod { get; set; }
        [XmlAttribute]
        public Boolean ShelfInventory { get; set; }
        [XmlArray]
        public Packaging[] PackagingList { get; set; }
    }
}
