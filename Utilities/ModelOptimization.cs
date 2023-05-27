using HydroFlowProject.BalanceModels;
using HydroFlowProject.BalanceModels.GeneticAlgorithm;
using HydroFlowProject.Models;
using HydroFlowProject.ViewModels;
using Microsoft.Build.Framework;
using Newtonsoft.Json;
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


        public static OptimizationViewModel Optimize(OptimizationViewModel optimizationViewModel, Model model)
        {
            OptimizationViewModel? result = optimizationViewModel.Model_Type switch
            {
                "ABCD" => Optimize_ABCD(optimizationViewModel, model),
                _ => new OptimizationViewModel
                {
                    Model_Id = optimizationViewModel.Model_Id,
                    Model_Type = optimizationViewModel.Model_Type,
                    Parameters = optimizationViewModel.Parameters
                },
            };
            return result;
        }

        private static OptimizationViewModel Optimize_ABCD(OptimizationViewModel optimizationViewModel, Model m)
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
                var P_List = JsonConvert.DeserializeObject<List<Double>>(optimizationViewModel.P)!.ToArray();
                var PET_List = JsonConvert.DeserializeObject<List<Double>>(optimizationViewModel.PET)!.ToArray();
                var Obsmm_List = JsonConvert.DeserializeObject<List<Double>>(optimizationViewModel.Obsmm)!.ToArray();
                var parameterMap = JsonConvert.DeserializeObject<Dictionary<string, float>>(optimizationViewModel.Parameters);
                var A = parameterMap!["a"];
                var B = parameterMap!["b"];
                var C = parameterMap!["c"];
                var D = parameterMap!["d"];
                var InitialSt = parameterMap!["initialSt"];
                var InitialGt = parameterMap!["initialGt"];

                var optimizePercent = m.Training_Percentage;
                var pForOptimization = new double[P_List.Length * optimizePercent / 100];
                var petForOptimization = new double[PET_List.Length * optimizePercent / 100];
                var obsmmForOptimization = new double[Obsmm_List.Length * optimizePercent / 100];

                var pForVerification = new double[P_List.Length - pForOptimization.Length];
                var petForVerification = new double[PET_List.Length - petForOptimization.Length];
                var obsmmForVerification = new double[Obsmm_List.Length - obsmmForOptimization.Length];
                
                var i = 0;
                for (; i < obsmmForOptimization.Length; i++)
                {
                    pForOptimization[i] = P_List[i];
                    petForOptimization[i] = PET_List[i];
                    obsmmForOptimization[i] = Obsmm_List[i];
                }
                for (; i < Obsmm_List.Length; i++)
                {
                    pForVerification[i - pForOptimization.Length] = P_List[i];
                    petForVerification[i - petForOptimization.Length] = PET_List[i];
                    obsmmForVerification[i - obsmmForOptimization.Length] = Obsmm_List[i];
                }

                var bestParams = GA_ABCD.Run(pForOptimization, petForOptimization, obsmmForOptimization, A, B, C, D, InitialSt, InitialGt);
                var best_A = bestParams["A"];
                var best_B = bestParams["B"];
                var best_C = bestParams["C"];
                var best_D = bestParams["D"];

                // Calculate optimization RMSE (And other possible statistics)
                var predictWithOptimizationArrays = GA_ABCD.Calculate(pForOptimization, petForOptimization, best_A, best_B, best_C, best_D, InitialSt, InitialGt);
                
                var rmseOptimization = GA_ABCD.Fitness(predictWithOptimizationArrays, obsmmForOptimization);
                var nseOptimization = GA_ABCD.NSE(predictWithOptimizationArrays, obsmmForOptimization);
                var averageForObservedOptimization = GA_ABCD.Average(obsmmForOptimization);
                var averageForPredictedOptimization = GA_ABCD.Average(predictWithOptimizationArrays);
                var deviationForObservedOptimization = GA_ABCD.StandartDeviation(obsmmForOptimization);
                var deviationForPredictedOptimization = GA_ABCD.StandartDeviation(predictWithOptimizationArrays);
                var skewnessForObservedOptimization = GA_ABCD.Skewness(obsmmForOptimization);
                var skewnessForPredictedOptimization = GA_ABCD.Skewness(predictWithOptimizationArrays);

                // Verification Steps
                var predictWithVerificationArrays = GA_ABCD.Calculate(pForVerification, petForVerification, best_A, best_B, best_C, best_D, InitialSt, InitialGt);
                var rmseVerification = GA_ABCD.Fitness(predictWithVerificationArrays, obsmmForVerification);
                var nseVerification = GA_ABCD.NSE(predictWithVerificationArrays, obsmmForVerification);
                var averageForObservedVerification = GA_ABCD.Average(obsmmForVerification);
                var averageForPredictedVerification = GA_ABCD.Average(predictWithVerificationArrays);
                var deviationForObservedVerification = GA_ABCD.StandartDeviation(obsmmForVerification);
                var deviationForPredictedVerification = GA_ABCD.StandartDeviation(predictWithVerificationArrays);
                var skewnessForObservedVerification = GA_ABCD.Skewness(obsmmForVerification);
                var skewnessForPredictedVerification = GA_ABCD.Skewness(predictWithVerificationArrays);

                Debug.WriteLine($"Best A: {best_A}, Best B: {best_B}, Best C: {best_C}, Best D: {best_D}");
                Debug.WriteLine($"Optimization RMSE: {rmseOptimization}, Verification RMSE: {rmseVerification}");

                // Scatter chart data for optimization
                // FIXME: değerlere bak
                var scatterDataOptimization = new double[obsmmForOptimization.Length][][];
                for (int j = 0; j < obsmmForOptimization.Length; j++)
                {
                    scatterDataOptimization[j] = new double[predictWithOptimizationArrays.Length][];
                    for (int k = 0; k < predictWithOptimizationArrays.Length; k++)
                    {
                        var scatterData = new double[2];
                        scatterData[0] = obsmmForOptimization[j];
                        scatterData[1] = predictWithOptimizationArrays[k];
                        scatterDataOptimization[j][k] = scatterData;
                    }
                }

                // Scatter chart data for verification
                var scatterDataVerification = new double[obsmmForVerification.Length][][];
                for (int j = 0; j < obsmmForVerification.Length; j++)
                {
                    scatterDataVerification[j] = new double[predictWithVerificationArrays.Length][];
                    for (int k = 0; k < predictWithVerificationArrays.Length; k++)
                    {
                        var scatterData = new double[2];
                        scatterData[0] = obsmmForVerification[j];
                        scatterData[1] = predictWithVerificationArrays[k];
                        scatterDataVerification[j][k] = scatterData;
                    }
                }

                // Collect statistics for optimization and verification
                Dictionary<string, double> optimizationStatistics = new Dictionary<string, double>();
                Dictionary<string, double> verificationStatistics = new Dictionary<string, double>();

                optimizationStatistics.Add("RMSE", rmseOptimization);
                optimizationStatistics.Add("NSE", nseOptimization);
                optimizationStatistics.Add("AverageObserved", averageForObservedOptimization);
                optimizationStatistics.Add("AveragePredicted", averageForPredictedOptimization);
                optimizationStatistics.Add("DeviationObserved", deviationForObservedOptimization);
                optimizationStatistics.Add("DeviationPredicted", deviationForPredictedOptimization);
                optimizationStatistics.Add("SkewnessObserved", skewnessForObservedOptimization);
                optimizationStatistics.Add("SkewnessPredicted", skewnessForPredictedOptimization);

                verificationStatistics.Add("RMSE", rmseVerification);
                verificationStatistics.Add("NSE", nseVerification);
                verificationStatistics.Add("AverageObserved", averageForObservedVerification);
                verificationStatistics.Add("AveragePredicted", averageForPredictedVerification);
                verificationStatistics.Add("DeviationObserved", deviationForPredictedOptimization);
                verificationStatistics.Add("DeviationPredicted", deviationForPredictedVerification);
                verificationStatistics.Add("SkewnessObserved", skewnessForObservedVerification);
                verificationStatistics.Add("SkewnessPredicted", skewnessForPredictedVerification);

                // Return optimization, verification results for charts and statistics
                result.Observed_Data_Optimization = obsmmForOptimization;
                result.Predicted_Data_Optimization = predictWithOptimizationArrays;

                result.Observed_Data_Verification = obsmmForVerification;
                result.Predicted_Data_Verification = predictWithVerificationArrays;

                result.Scatter_Data_Optimization = scatterDataOptimization;
                result.Scatter_Data_Verification = scatterDataVerification;

                result.Optimized_Parameters = bestParams;

                result.Statistics_Optimization = optimizationStatistics;
                result.Statistics_Verification = verificationStatistics;

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
