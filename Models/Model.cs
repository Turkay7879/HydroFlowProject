using System.Collections;

namespace HydroFlowProject.Models
{
    public class Model
    {
        // Unique identifier of the model.
        public int Id { get; set; }

        // Name of the model.
        public string Name { get; set; } = null!;

        // Title of the model.
        public string Title { get; set; } = null!;

        // Date and time when the model was created.
        public DateTime? CreateDate { get; set; }

        // Binary file containing the model.
        public byte[] ModelFile { get; set; } = null!;

        // Identifier of the model permission.
        public int ModelPermissionId { get; set; }

        // Collection of basin models associated with this model.
        public virtual ICollection<BasinModel> BasinModels { get; } = new List<BasinModel>();

        // Collection of model-model type relationships associated with this model.
        public virtual ICollection<ModelModelType> ModelModelTypes { get; } = new List<ModelModelType>();

        // Collection of model parameters associated with this model.
        public virtual ICollection<ModelParameter> ModelParameters { get; } = new List<ModelParameter>();

        // Collection of user models associated with this model.
        public virtual ICollection<UserModel> UserModels { get; } = new List<UserModel>();

        // Collection of user-user permission relationships associated with this model.
        public virtual ICollection<UserUserPermission> UserUserPermissions { get; } = new List<UserUserPermission>();

        // Collection of simulation details associated with this model.
        public virtual ICollection<SimulationDetails> SimulationDetails { get; } = new List<SimulationDetails>();
    }
}