namespace HydroFlowProject.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string? CorporationName { get; set; }

        public string Email { get; set; } = null!;

        public byte[] Password { get; set; } = null!;

        public byte[] PasswordSalt { get; set; } = null!;

        public virtual ICollection<BasinUserPermission> BasinUserPermissions { get; } = new List<BasinUserPermission>();

        public virtual ICollection<UserModel> UserModels { get; } = new List<UserModel>();

        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();

        public virtual ICollection<UserUserPermission> UserUserPermissionPermittedUsers { get; } = new List<UserUserPermission>();

        public virtual ICollection<UserUserPermission> UserUserPermissionUsers { get; } = new List<UserUserPermission>();
    }
}
