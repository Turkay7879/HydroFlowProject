namespace HydroFlowProject.Models;

public class BalanceModelType
{
    public int ModelType_Id { get; set; }
    
    public string ModelType_Definition { get; set; } = null!;

    public virtual ICollection<ModelModelType> ModelModelTypes { get; } = new List<ModelModelType>();
}