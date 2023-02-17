namespace HydroFlowProject.Models
{
    public class BasinPermission
    {
        public int Id { get; set; }

        public int BasinId { get; set; }

        public bool? BasinPermissionType { get; set; }

        public bool? BasinSpecPerm { get; set; }

        public bool? UserSpecPerm { get; set; }

        public virtual Basin Basin { get; set; } = null!;
    }
}
