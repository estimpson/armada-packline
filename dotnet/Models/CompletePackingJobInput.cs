using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class CompletePackingJobInput
    {
        public string PackingJobNumber { get; set; }
        public bool ShelfInventoryFlag { get; set; }
        public bool JobDoneFlag { get; set; }
    }
}
