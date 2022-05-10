using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class GeneratePreObjectsInput
    {
        public string PackingJobNumber { get; set; }
        public int Boxes { get; set; }
        public decimal PartialBoxQuantity { get; set; }
    }
}
