namespace HydroFlowProject.Models
{
    public class BasinUserPermission
    {
        // Unique identifier of the basin-user permission relationship.
        public int Id { get; set; }

        // Identifier of the basin.
        public int BasinId { get; set; }

        // Identifier of the user associated with the permission.
        public int UserId { get; set; }

        // Identifier of the user who granted the permission (nullable).
        public int? PermUserId { get; set; }

        // Indicates whether the user has permission to access the latitude of the basin (nullable).
        public bool? PermLat { get; set; }

        // Indicates whether the user has permission to access the longitude of the basin (nullable).
        public bool? PermLong { get; set; }

        // Indicates whether the user has permission to access the station number of the basin (nullable).
        public bool? PermStationNo { get; set; }

        // Basin associated with the basin-user permission relationship.
        public virtual Basin Basin { get; set; } = null!;

        // User associated with the basin-user permission relationship.
        public virtual User User { get; set; } = null!;
    }
}