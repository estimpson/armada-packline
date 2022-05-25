using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace api.Models
{
    [XmlRoot]
    public class Machine
    {
        [XmlAttribute] public string machineCode { get; set; }
        [XmlAttribute] public string machineDescription { get; set; }
    }
}
