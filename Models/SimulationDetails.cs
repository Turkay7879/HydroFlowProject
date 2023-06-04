namespace HydroFlowProject.Models
{
    public class SimulationDetails
    {
        // Unique identifier of the simulation.
        public long Id { get; set; }

        // Identifier of the user who created the simulation.
        public int User_Id { get; set; }

        // Identifier of the model used for the simulation.
        public int Model_Id { get; set; }

        // Name of the model used for the simulation.
        public string Model_Name { get; set; } = null!;

        // Percentage of optimization used for the simulation.
        public int Optimization_Percentage { get; set; }

        // Version number of the simulation.
        public long Version { get; set; }

        // Date and time when the simulation was performed.
        public DateTime? Simulation_Date { get; set; }

        // Date range used for the simulation.
        public string Simulation_Date_Range { get; set; } = null!;

        // Model used for the simulation.
        public virtual Model Model { get; set; } = null!;

        // User who created the simulation.
        public virtual User User { get; set; } = null!;
    }
}