namespace HydroFlowProject.Models
{
    public class UserModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ModelId { get; set; }

        public virtual Model Model { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}
