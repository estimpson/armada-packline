using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class NewPackingJobInput
    {
        public string PartCode { get; set; }
        public string PackagingCode { get; set; }
        public decimal StandardPack { get; set; }
        public string SpecialInstructions { get; set; }
        public decimal PieceWeightQuantity { get; set; }
        public double PieceWeight { get; set; }
        public double PieceWeightTolerance { get; set; }
        public bool PieceWeightValid { get; set; }
        public string PieceWeightDiscrepancyNote { get; set; }
        public string DeflashOperator { get; set; }
        public string DeflashMachine { get; set; }
    }
}
