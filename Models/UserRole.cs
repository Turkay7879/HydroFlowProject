using System.Data;

namespace HydroFlowProject.Models
{
    public class UserRole
    {
        public int Id { get; set; }  // Primary key        

        public int UserId { get; set; } // Foreign key to User          

        public int RoleId { get; set; } // Foreign key to Role         

        public DateTime? UserRoleDate { get; set; } // Date role was assigned     

        public virtual Role Role { get; set; }=null!;  // Navigation property to related Role              

        public virtual User User { get; set; }= null!; // Navigation property to related User      

    }
}