namespace HydroFlowProject.Models;

public class BalanceModelType
{
    // Identifier of the balance model type.
    public int ModelType_Id { get; set; }

    // Definition of the balance model type.
    public string ModelType_Definition { get; set; } = null!;

    // Collection of model-model type relationships associated with this balance model type.
    public virtual ICollection<ModelModelType> ModelModelTypes { get; } = new List<ModelModelType>();
}