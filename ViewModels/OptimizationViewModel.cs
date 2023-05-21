namespace HydroFlowProject.ViewModels
{
    public class OptimizationViewModel
    {
        public int Model_Id { get; set; }
        public string Model_Type { get; set; } = null!;
        public string Parameters { get; set; } = null!;
        public object? Observed_Data { get; set; }
        public object? Predicted_Data { get; set; }
        public object? Scatter_Data { get; set; }
        public object? Optimized_Parameters { get; set; }
    }
}
