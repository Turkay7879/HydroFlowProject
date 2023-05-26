namespace HydroFlowProject.ViewModels
{
    public class OptimizationViewModel
    {
        public int Model_Id { get; set; }
        public string Model_Type { get; set; } = null!;
        public string Parameters { get; set; } = null!;
        public string P { get; set; } = null!;
        public string PET { get; set; } = null!;
        public string Obsmm { get; set; } = null!;
        public object? Observed_Data_Optimization { get; set; }
        public object? Predicted_Data_Optimization { get; set; }
        public object? Observed_Data_Verification { get; set; }
        public object? Predicted_Data_Verification { get; set; }
        public object? Scatter_Data_Optimization { get; set; }
        public object? Scatter_Data_Verification { get; set; }
        public object? Optimized_Parameters { get; set; }
        public object? Statistics_Optimization { get; set; }
        public object? Statistics_Verification { get; set; }
    }
}
