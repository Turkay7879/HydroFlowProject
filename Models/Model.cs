namespace HydroFlowProject.Models
{
    public class Model
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Title { get; set; } = null!;

        public DateTime? CreateDate { get; set; } = DateTime.Now;

        public byte[] ModelFile { get; set; } = null!;

        public int ModelPermissionId { get; set; }
        ///public byte[] CreateDate { get; set; } = null!;
        public virtual ICollection<BasinModel> BasinModels { get; } = new List<BasinModel>();

        public virtual ICollection<UserModel> UserModels { get; } = new List<UserModel>();

        public virtual ICollection<UserUserPermission> UserUserPermissions { get; } = new List<UserUserPermission>();
    }
}
