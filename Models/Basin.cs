namespace HydroFlowProject.Models
{
    public class Basin
    {
        public int Id { get; set; }

        public string BasinName { get; set; } = null!;

        public string FlowStationNo { get; set; } = null!;

        public double FlowObservationStationLat { get; set; }

        public double FlowObservationStationLong { get; set; }

        public int Field { get; set; }

        public string? Description { get; set; }

        public virtual ICollection<BasinModel> BasinModels { get; } = new List<BasinModel>();

        public virtual ICollection<BasinPermission> BasinPermissions { get; } = new List<BasinPermission>();

        public virtual ICollection<BasinUserPermission> BasinUserPermissions { get; } = new List<BasinUserPermission>();
    }
}
