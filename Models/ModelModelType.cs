namespace HydroFlowProject.Models;

public class ModelModelType
{
    // Unique identifier of the model-model type relationship.
    public int Id { get; set; }

    // Identifier of the model.
    public int Model_Id { get; set; }

    // Identifier of the model type.
    public int Model_Type_Id { get; set; }

    // Model associated with the model-model type relationship.
    public virtual Model Model { get; set; } = null!;

    // Model type associated with the model-model type relationship.
    public virtual BalanceModelType BalanceModelType { get; set; } = null!;
}