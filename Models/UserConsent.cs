namespace HydroFlowProject.Models
{
    public class UserConsent
    {
        public int Id { get; set; }
        public int User_Id { get; set; }
        public bool Consent { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
