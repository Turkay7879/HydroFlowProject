namespace HydroFlowProject.Models;

public class ModelParameter
{
    // Identifier of the parameter.
    public int Parameter_Id { get; set; }
    
    // Identifier of the model.
    public int Model_Id { get; set; }

    // Identifier of the user who created the parameter.
    public int User_Id { get; set; }
    
    // Value of the parameter for the specific model.
    public float Model_Param { get; set; }

    // Name of the parameter.
    public string Model_Param_Name { get; set; } = null!;

    // Model associated with the parameter.
    public virtual Model Model { get; set; } = null!;

    // User who created the parameter.
    public virtual User User { get; set; } = null!;
}