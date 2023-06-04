namespace HydroFlowProject.Models
{
    public class Basin
    {
        // Unique identifier of the basin.
        public int Id { get; set; }

        // Name of the basin.
        public string BasinName { get; set; } = null!;

        // Flow station number of the basin.
        public string FlowStationNo { get; set; } = null!;

        // Latitude of the flow observation station of the basin.
        public double FlowObservationStationLat { get; set; }

        // Longitude of the flow observation station of the basin.
        public double FlowObservationStationLong { get; set; }

        // Field number of the basin.
        public int Field { get; set; }

        // Description of the basin (nullable).
        public string? Description { get; set; }

        // Collection of basin-model relationships associated with this basin.
        public virtual ICollection<BasinModel> BasinModels { get; } = new List<BasinModel>();

        // Collection of basin permissions associated with this basin.
        public virtual ICollection<BasinPermission> BasinPermissions { get; } = new List<BasinPermission>();

        // Collection of basin-user permission relationships associated with this basin.
        public virtual ICollection<BasinUserPermission> BasinUserPermissions { get; } = new List<BasinUserPermission>();
    }
}