namespace HydroFlowProject.Models
{
    public class SimulationDetails
    {
        public long Id { get; set; }
        public int User_Id { get; set; }
        public int Model_Id { get; set; }
        public string Model_Name { get; set; } = null!;
        public int Optimization_Percentage { get; set; }
        public long Version { get; set; }
        public DateTime? Simulation_Date { get; set; }

        public virtual Model Model { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
