namespace HydroFlowProject.Models
{
    public class Role
    {
        public int Id { get; set; }

        public string RoleDescription { get; set; } = null!;

        public string RoleValue { get; set; } = null!;

        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    }
}
