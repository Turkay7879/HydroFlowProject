using HydroFlowProject.Models;
using HydroFlowProject.ViewModels;
using System.Diagnostics;

namespace HydroFlowProject.Utilities
{
    public static class ModelOptimization
    {
        private static readonly int MAX_USERS_TO_CALL_OPTIMIZATION_AT_SAME_TIME = 100;
        private static Semaphore semaphore = new Semaphore(0, MAX_USERS_TO_CALL_OPTIMIZATION_AT_SAME_TIME);

        public static OptimizationViewModel Optimize(OptimizationViewModel optimizationViewModel)
        {
            OptimizationViewModel? result = optimizationViewModel.Model_Type switch
            {
                "ABCD" => Optimize_ABCD(optimizationViewModel),
                _ => new OptimizationViewModel
                {
                    Model_Id = optimizationViewModel.Model_Id,
                    Model_Type = optimizationViewModel.Model_Type,
                    Parameters = optimizationViewModel.Parameters
                },
            };
            return result;
        }

        private static OptimizationViewModel Optimize_ABCD(OptimizationViewModel optimizationViewModel)
        {
            try
            {
                // Initialize result with given input for now
                // It is going to be updated once optimization starts
                var result = new OptimizationViewModel
                {
                    Model_Id = optimizationViewModel.Model_Id,
                    Model_Type = optimizationViewModel.Model_Type,
                    Parameters = optimizationViewModel.Parameters
                };

                // Optimization Operations Here

                return result;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return new OptimizationViewModel
                {
                    Model_Id = optimizationViewModel.Model_Id,
                    Model_Type = optimizationViewModel.Model_Type,
                    Parameters = optimizationViewModel.Parameters
                };
            }
        }
    }
}
