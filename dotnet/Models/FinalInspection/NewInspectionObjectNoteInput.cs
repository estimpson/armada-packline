﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class NewInspectionObjectNoteInput
    {
        public string InspectionJobNumber { get; set; }
        public int Serial { get; set; }
        public string Note { get; set; }
    }
}
