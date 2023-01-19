﻿using System;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class InspectionObjectNote
    {
        [XmlAttribute]
        public string InspectionJobNumber { get; set; }
        [XmlAttribute]
        public int Serial { get; set; }
        [XmlAttribute]
        public string Note { get; set; }
        [XmlAttribute]
        public string CreatedByOperator { get; set; }
        [XmlAttribute]
        public DateTime CreateDT { get; set; }
        [XmlAttribute]
        public int NoteID { get; set; }
    }
}