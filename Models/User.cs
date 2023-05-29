namespace HydroFlowProject.Models
{
    public class User 
    {
        public int Id { get; set; }  // Primary key

        public string Name { get; set; } = null!; // Required user name


       public string Surname { get; set; } = null!; // Required surname        
        
        public string? CorporationName { get; set; } // Optional corporation name

        public string Email { get; set; } = null!; // Required email


        public byte[] Password { get; set; } = null!;// Password hash


        public byte[] PasswordSalt { get; set; } = null!;// Password salt        

        public virtual ICollection<BasinUserPermission> BasinUserPermissions { get; } = new List<BasinUserPermission>(); // Basin permissions for the user    

        public virtual ICollection<UserModel> UserModels { get; } = new List<UserModel>(); // Models the user has access to        

        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();  // Roles assigned to the user

        public virtual ICollection<Session> UserSessions { get; } = new List<Session>(); // Current user sessions

        public virtual ICollection<UserUserPermission> UserUserPermissionPermittedUsers { get; } = new List<UserUserPermission>(); // Users the user has granted permissions to          

        public virtual ICollection<UserUserPermission> UserUserPermissionUsers { get; } = new List<UserUserPermission>(); // Users who have granted permissions to this user

        public virtual ICollection<UserConsent> UserConsents { get; } = new List<UserConsent>(); // The user's consent status

        public virtual ICollection<SimulationDetails> SimulationDetails { get; } = new List<SimulationDetails>(); // Simulation details owned by the user         

        public virtual ICollection<ModelParameter> ModelParameters { get; } = new List<ModelParameter>();  // Model parameters owned by the user
    }
}
