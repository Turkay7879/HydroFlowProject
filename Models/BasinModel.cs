namespace HydroFlowProject.Models
{
    public class BasinModel
    {
        public int Id { get; set; }

        public int BasinId { get; set; }

        public int ModelId { get; set; }

        public virtual Basin Basin { get; set; } = null!;

        public virtual Model Model { get; set; } = null!;
    }
}
