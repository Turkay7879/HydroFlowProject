namespace HydroFlowProject.Models;

public class ModelParameter
{
    public int Parameter_Id { get; set; }
    
    public int Model_Id { get; set; }
    
    public float Model_Param { get; set; }

    public string Model_Param_Name { get; set; } = null!;

    public virtual Model Model { get; set; }
}