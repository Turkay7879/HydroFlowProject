namespace HydroFlowProject.ViewModels;

public class ModelParameterSaveViewModel
{
    public int User_Id { get; set; }
    public int Model_Id { get; set; }
    public string Model_Name { get; set; } = null!;
    public string Parameter_Map { get; set; } = null!;  
}