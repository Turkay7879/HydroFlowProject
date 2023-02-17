namespace HydroFlowProject.Models
{
    public class UserUserPermission
    {
        public int Id { get; set; }

        public int ModelId { get; set; }

        public int UserId { get; set; }

        public int PermittedUserId { get; set; }

        public bool? PermData { get; set; }

        public bool? PermDownload { get; set; }

        public bool? PermSimulation { get; set; }

        public virtual Model Model { get; set; } = null!;

        public virtual User PermittedUser { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}
