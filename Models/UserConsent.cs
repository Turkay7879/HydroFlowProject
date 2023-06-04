namespace HydroFlowProject.Models
{
    public class UserConsent
    {
        public int Id { get; set; } // Primary key

        public int User_Id { get; set; } // Foreign key to User

        public bool Consent { get; set; } // Consent flag indicating if user consented to data use

        public virtual User User { get; set; } = null!; // Navigation property to related User           


    }
}