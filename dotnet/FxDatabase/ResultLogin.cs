using System.ComponentModel.DataAnnotations;

namespace api.FxDatabase
{
    public class ResultLogin
    {
        [Key] public string user { get; set; }
        public string name { get; set; }
    }
}
