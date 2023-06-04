namespace HydroFlowProject.Models
{
    public class Role
    {
        // Unique identifier of the role.
        public int Id { get; set; }

        // Description of the role.
        public string RoleDescription { get; set; } = null!;

        // Value of the role.
        public string RoleValue { get; set; } = null!;

        // Collection of user roles associated with this role.
        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    }
}