namespace HydroFlowProject.Models
{
    public class UserModel
    {
        public int Id { get; set; } // Primary key

        public int UserId { get; set; } // Foreign key to User  

        public int ModelId { get; set; } // Foreign key to Model      

        public virtual Model Model { get; set; } = null!; // Navigation property to related Model               


        public virtual User User { get; set; } = null!;   // Navigation property to related User           


    }
}