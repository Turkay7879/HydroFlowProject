namespace HydroFlowProject.Models
{
    public class UserUserPermission
    {
        public int Id { get; set; }  // Primary key

        public int ModelId { get; set; } // Foreign key to Model    

        public int UserId { get; set; } // Foreign key to User who granted permission

        public int PermittedUserId { get; set; } // Foreign key to permitted User      

        public bool? PermData { get; set; }  // Data access permission

        public bool? PermDownload { get; set; } // Model download permission    

        public bool? PermSimulation { get; set; } // Model simulation permission  

        public virtual Model Model { get; set; } = null!;// Navigation property to related Model

        public virtual User PermittedUser { get; set; } = null!;// Navigation property to permitted User               

        public virtual User User { get; set; } = null!;// Navigation property to User who granted permission            

    }
}