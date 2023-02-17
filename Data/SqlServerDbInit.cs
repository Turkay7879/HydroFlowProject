using HydroFlowProject.Models;

namespace HydroFlowProject.Data
{
    public static class SqlServerDbInit
    {
        public static void Initialize(SqlServerDbContext context) 
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return;
            }

            // Initialize db with some data
        }
    }
}
