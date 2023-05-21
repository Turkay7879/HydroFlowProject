using HydroFlowProject.BalanceModels;
using HydroFlowProject.BalanceModels.GeneticAlgorithm;
using HydroFlowProject.Models;
using HydroFlowProject.ViewModels;
using System.Diagnostics;

namespace HydroFlowProject.Utilities
{
    public static class ModelOptimization
    {
        private static readonly Int32 DEFAULT_THREAD_COUNT = 4;
        private static readonly int MAX_USERS_TO_CALL_OPTIMIZATION_AT_SAME_TIME = 100;
        private static Semaphore semaphore = new Semaphore(0, MAX_USERS_TO_CALL_OPTIMIZATION_AT_SAME_TIME);

        private static readonly double CROSSOVER_RATE = 0.8;
        private static readonly double MUTATION_RATE = 0.05;
        private static readonly int POPULATION_SIZE = 100;
        private static readonly int TERMINATION_GENERATIONS = 10;
        private static readonly double TERMINATION_THRESHOLD = 0.001;


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
                ABCDModel model = new ABCDModel();
                model.SetParams(1, 5, 0.5, 0.1);

                GA geneticAlgorithm = new GA(model, UpdateProgress, DEFAULT_THREAD_COUNT, CROSSOVER_RATE, MUTATION_RATE, POPULATION_SIZE, TERMINATION_GENERATIONS, TERMINATION_THRESHOLD);
                geneticAlgorithm.Go();

                double[] bestGenes; double bestFitness;
                geneticAlgorithm.GetBest(out bestGenes, out bestFitness);

                double bestA = bestGenes[0];
                double bestB = bestGenes[1];
                double bestC = bestGenes[2];
                double bestD = bestGenes[3];

                Debug.WriteLine("A: " + bestA);
                Debug.WriteLine("B: " + bestB);
                Debug.WriteLine("C: " + bestC);
                Debug.WriteLine("D: " + bestD);

                // Verification Step here, then results

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

        static void UpdateProgress(String[] s)
        {
            Debug.WriteLine("Generations complete: " + s[0]);
        }
    }
}
