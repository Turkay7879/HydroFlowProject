namespace HydroFlowProject.Models
{
    public class BasinPermission
    {
        // Unique identifier of the basin permission.
        public int Id { get; set; }

        // Identifier of the basin associated with the permission.
        public int BasinId { get; set; }

        // Indicates the type of basin permission (nullable).
        public bool? BasinPermissionType { get; set; }

        // Indicates whether the basin has specific permissions (nullable).
        public bool? BasinSpecPerm { get; set; }

        // Indicates whether the user has specific permissions (nullable).
        public bool? UserSpecPerm { get; set; }

        // Basin associated with the basin permission.
        public virtual Basin Basin { get; set; } = null!;
    }
}