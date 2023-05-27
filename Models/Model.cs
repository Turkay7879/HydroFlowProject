using System.Collections;

namespace HydroFlowProject.Models
{
    public class Model
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Title { get; set; } = null!;

        public DateTime? CreateDate { get; set; }

        public byte[] ModelFile { get; set; } = null!;

        public int ModelPermissionId { get; set; }

        public virtual ICollection<BasinModel> BasinModels { get; } = new List<BasinModel>();

        public virtual ICollection<ModelModelType> ModelModelTypes { get; } = new List<ModelModelType>();

        public virtual ICollection<ModelParameter> ModelParameters { get; } = new List<ModelParameter>();

        public virtual ICollection<UserModel> UserModels { get; } = new List<UserModel>();

        public virtual ICollection<UserUserPermission> UserUserPermissions { get; } = new List<UserUserPermission>();

        public virtual ICollection<SimulationDetails> SimulationDetails { get; } = new List<SimulationDetails>();
    }
}
