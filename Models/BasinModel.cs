namespace HydroFlowProject.Models
{
    public class BasinModel
    {
        // Unique identifier of the basin-model relationship.
        public int Id { get; set; }

        // Identifier of the basin associated with the relationship.
        public int BasinId { get; set; }

        // Identifier of the model associated with the relationship.
        public int ModelId { get; set; }

        // Basin associated with the basin-model relationship.
        public virtual Basin Basin { get; set; } = null!;

        // Model associated with the basin-model relationship.
        public virtual Model Model { get; set; } = null!;
    }
}