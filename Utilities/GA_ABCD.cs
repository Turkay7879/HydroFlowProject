using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace HydroFlowProject.Utilities
{
    public static class GA_ABCD
    {
        static Random random = new Random();
        static int populationSize = 200;
        static int numGenerations = 200;
        static double crossoverThreshold = 0.5;
        static double mutationRate = 0.5;
        static double randomParamRangeLimit = 0.2;
        static double[] P;
        static double[] PET;
        static double[] Obsmm;
        static double initialA;
        static double initialB;
        static double initialC;
        static double initialD;
        static double initialSt;
        static double initialGt;

        static Dictionary<string, Tuple<double, double>> paramRange = new Dictionary<string, Tuple<double, double>>
        {
            { "A", Tuple.Create(0.0, 1.0) },
            { "B", Tuple.Create(0.0, 300.0) },
            { "C", Tuple.Create(0.0, 1.0) },
            { "D", Tuple.Create(0.0, 1.0) }
        };

        public static double[] Calculate(double[] P, double[] PET, double A, double B, double C, double D, double initialSt, double initialGt)
        {
            // Perform the calculation using the given parameters
            var W = new Double[P.Length];       // Available soil water
            var S = new Double[P.Length];       // Soil moisture
            var Y = new Double[P.Length];       // Evapotranspiration potential
            var G = new Double[P.Length];       // Groundwater storage
            var ET = new Double[P.Length];      // Actual evapotranspiration
            var DR = new Double[P.Length];      // Direct runoff
            var GR = new Double[P.Length];      // Groundwater recharge
            var GD = new Double[P.Length];      // Groundwater discharge

            var Qmodel = new Double[P.Length];  // Predictions

            for (int i = 0; i < P.Length; i++)
            {
                // Step 1
                if (i == 0)
                {
                    W[i] = initialSt + P[i];
                }
                else
                {
                    W[i] = S[i - 1] + P[i];
                }

                // Step 2
                Y[i] = ((W[i] + B) / (2 * A)) - Math.Sqrt(Math.Pow((W[i] + B) / (2 * A), 2) - (B * W[i] / A));

                // Step 3
                S[i] = Y[i] * Math.Exp(-1 * PET[i] / B);

                // Step 4
                ET[i] = Y[i] * (1 - Math.Exp(-1 * PET[i] / B));

                // Step 5
                DR[i] = (1 - C) * (W[i] - Y[i]);

                // Step 6
                GR[i] = C * (W[i] - Y[i]);

                // Step 7
                if (i == 0)
                {
                    G[i] = 1 / (1 + D) * (initialGt + GR[i]);
                }
                else
                {
                    G[i] = 1 / (1 + D) * (G[i - 1] + GR[i]);
                }

                // Step 8
                GD[i] = D * G[i];

                // Step 9
                Qmodel[i] = DR[i] + GD[i];
            }

            return Qmodel;
        }

        // Calculate RMSE rate by comparing actual and predicted values
        public static double Fitness(double[] predictedValues, double[] targetValues)
        {
            // Calculate fitness as the mean squared error
            double sumSquaredError = 0.0;
            for (int i = 0; i < predictedValues.Length; i++)
            {
                double error = predictedValues[i] - targetValues[i];
                sumSquaredError += error * error;
            }
            return Math.Sqrt(sumSquaredError / predictedValues.Length);
        }

        // Calculate NSE rate by comparing actual and predicted values
        public static double NSE(double[] predicted, double[] observed)
        {
            int n = observed.Length;
            double sumSquaredObserved = 0.0;
            double sumSquaredDifference = 0.0;

            for (int i = 0; i < n; i++)
            {
                sumSquaredObserved += Math.Pow(observed[i], 2);
                double difference = observed[i] - predicted[i];
                sumSquaredDifference += Math.Pow(difference, 2);
            }

            double nse = 1 - (sumSquaredDifference / sumSquaredObserved);
            return nse;
        }

        // Calculate average of given array
        public static double Average(double[] values)
        {
            double mean = 0.0;
            for (int i = 0; i < values.Length; i++)
            {
                mean += values[i];
            }
            mean /= values.Length;
            return mean;
        }

        // Calculate standart deviation of given array
        public static double StandartDeviation(double[] values)
        {
            double mean = Average(values);
            double sumDifferenceFromMean = 0.0;

            for (int i = 0; i < values.Length; i++)
            {
                sumDifferenceFromMean += Math.Pow(values[i] - mean, 2);
            }
            double deviation = Math.Sqrt(sumDifferenceFromMean / (values.Length - 1));

            return deviation;
        }

        // Calculate skewness of given array
        public static double Skewness(double[] values)
        {
            double mean = Average(values);
            double deviation = StandartDeviation(values);
            double sumDifferenceFromMean = 0.0;

            for (int i = 0; i < values.Length; i++)
            {
                sumDifferenceFromMean += Math.Pow(values[i] - mean, 3);
            }
            double skewness = sumDifferenceFromMean / ((values.Length - 1) * Math.Pow(deviation, 3));

            return skewness;
        }

        static Dictionary<string, double> CreateRandomIndividual()
        {
            // Create a random individual with values within the parameter range
            Dictionary<string, double> individual = new Dictionary<string, double>();
            var randA = -1.0;
            var randB = -1.0;
            var randC = -1.0;
            var randD = -1.0;
            while (Math.Abs(randA - initialA) > randomParamRangeLimit)
            {
                randA = random.NextDouble();
            }
            while (Math.Abs(randB - initialB) > randomParamRangeLimit * 1000)
            {
                randB = random.NextDouble() * 100;
            }
            while (Math.Abs(randC - initialC) > randomParamRangeLimit)
            {
                randC = random.NextDouble();
            }
            while (Math.Abs(randD - initialD) > randomParamRangeLimit)
            {
                randD = random.NextDouble();
            }
            individual.Add("A", randA);
            individual.Add("B", randB);
            individual.Add("C", randC);
            individual.Add("D", randD);
            return individual;
        }

        static List<Dictionary<string, double>> InitializePopulation()
        {
            // Initialize the population with random individuals
            List<Dictionary<string, double>> population = new List<Dictionary<string, double>>();
            for (int i = 0; i < populationSize; i++)
            {
                Dictionary<string, double> individual = CreateRandomIndividual();
                population.Add(individual);
            }
            return population;
        }

        static List<Dictionary<string, double>> SelectParents(List<Dictionary<string, double>> population, double[] targetValues)
        {
            // Perform tournament selection to choose parents for reproduction
            List<Dictionary<string, double>> parents = new List<Dictionary<string, double>>();
            for (int i = 0; i < populationSize; i++)
            {
                int index1 = random.Next(populationSize);
                int index2 = random.Next(populationSize);
                Dictionary<string, double> parent1 = population[index1];
                Dictionary<string, double> parent2 = population[index2];
                double fitness1 = Fitness(Calculate(P, PET, parent1["A"], parent1["B"], parent1["C"], parent1["D"], initialSt, initialGt), targetValues);
                double fitness2 = Fitness(Calculate(P, PET, parent2["A"], parent2["B"], parent2["C"], parent2["D"], initialSt, initialGt), targetValues);
                parents.Add(fitness1 < fitness2 ? parent1 : parent2);
            }
            return parents;
        }

        static Dictionary<string, double> Crossover(Dictionary<string, double> parent1, Dictionary<string, double> parent2)
        {
            // Perform uniform crossover between two parents
            Dictionary<string, double> child = new Dictionary<string, double>();
            foreach (string parameter in paramRange.Keys)
            {
                double value;
                if (random.NextDouble() < crossoverThreshold)
                    value = parent1[parameter];
                else
                    value = parent2[parameter];
                child.Add(parameter, value);
            }
            return child;
        }

        static void Mutate(ref Dictionary<string, double> individual)
        {
            // Perform mutation on an individual by randomly perturbing its parameters
            foreach (string parameter in paramRange.Keys)
            {
                double minValue = paramRange[parameter].Item1;
                double maxValue = paramRange[parameter].Item2;
                double value = individual[parameter] + (maxValue - minValue) * random.NextDouble() - (maxValue - minValue) * mutationRate;
                value = Math.Max(minValue, Math.Min(maxValue, value));
                individual[parameter] = value;
            }
        }

        static List<Dictionary<string, double>> Reproduce(List<Dictionary<string, double>> parents)
        {
            // Perform crossover and mutation to create the next generation
            List<Dictionary<string, double>> offspring = new List<Dictionary<string, double>>();
            for (int i = 0; i < populationSize; i++)
            {
                Dictionary<string, double> parent1 = parents[i];
                Dictionary<string, double> parent2 = parents[i + 1 == populationSize ? 0 : i + 1];
                Dictionary<string, double> child = Crossover(parent1, parent2);
                Mutate(ref child);
                offspring.Add(child);
            }
            return offspring;
        }

        // Entry function to run Genetic Algorithm for ABCD model
        public static Dictionary<string, double> Run(double[] arr1, double[] arr2, double[] arr3, double A, double B, double C, double D, double initS, double initG)
        {
            P = arr1;
            PET = arr2;
            Obsmm = arr3;
            initialA = A;
            initialB = B;
            initialC = C;
            initialD = D;
            initialSt = initS;
            initialGt = initG;

            List<Dictionary<string, double>> population = InitializePopulation();
            Dictionary<string, double> bestIndividual = null;
            double bestFitness = double.MaxValue;

            for (int generation = 0; generation < numGenerations; generation++)
            {
                List<Dictionary<string, double>> parents = SelectParents(population, Obsmm);
                List<Dictionary<string, double>> offspring = Reproduce(parents);
                population = offspring;

                foreach (var individual in population)
                {
                    double[] predictedValues = Calculate(P, PET, individual["A"], individual["B"], individual["C"], individual["D"], initialSt, initialGt);
                    double fitness = Fitness(predictedValues, Obsmm);
                    if (fitness < bestFitness)
                    {
                        bestFitness = fitness;
                        bestIndividual = individual;
                    }
                }
            }

            return bestIndividual;
        }
    }
}