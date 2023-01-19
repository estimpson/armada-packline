using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class SetHeaderInspectionStatusInput
    {
        public string InspectionJobNumber { get; set; }
        public string InspectionStatus { get; set; }
    }
}
