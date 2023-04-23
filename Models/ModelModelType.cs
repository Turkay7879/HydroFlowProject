namespace HydroFlowProject.Models;

public class ModelModelType
{
    public int Id { get; set; }
    
    public int Model_Id { get; set; }
    
    public int Model_Type_Id { get; set; }

    public virtual Model Model { get; set; } = null!;

    public virtual BalanceModelType BalanceModelType { get; set; } = null!;
}