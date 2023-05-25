using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace HydroFlowProject.Utilities
{
    public static class GA_ABCD
    {
        static Random random = new Random();
        static int populationSize = 200;
        static int numGenerations = 100;
        static double crossoverThreshold = 0.8;
        static double mutationRate = 0.5;
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

        static double[] Calculate(double[] P, double[] PET, double A, double B, double C, double D, double initialSt, double initialGt)
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
                ;

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

        static double Fitness(double[] predictedValues)
        {
            // Calculate fitness as the mean squared error
            double sumSquaredError = 0.0;
            for (int i = 0; i < predictedValues.Length; i++)
            {
                double error = predictedValues[i] - Obsmm[i];
                sumSquaredError += error * error;
            }
            return Math.Sqrt(sumSquaredError / predictedValues.Length);
        }

        static Dictionary<string, double> CreateRandomIndividual()
        {
            // Create a random individual with values within the parameter range
            Dictionary<string, double> individual = new Dictionary<string, double>();
            individual.Add("A", initialA);
            individual.Add("B", initialB);
            individual.Add("C", initialC);
            individual.Add("D", initialD);
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
                double fitness1 = Fitness(Calculate(P, PET, parent1["A"], parent1["B"], parent1["C"], parent1["D"], initialSt, initialGt));
                double fitness2 = Fitness(Calculate(P, PET, parent2["A"], parent2["B"], parent2["C"], parent2["D"], initialSt, initialGt));
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
            double[] predictedValues = new double[1];

            for (int generation = 0; generation < numGenerations; generation++)
            {
                List<Dictionary<string, double>> parents = SelectParents(population, Obsmm);
                List<Dictionary<string, double>> offspring = Reproduce(parents);
                population = offspring;

                
                

                foreach (var individual in population)
                {
                    predictedValues = Calculate(P, PET, individual["A"], individual["B"], individual["C"], individual["D"], initialSt, initialGt);
                    double fitness = Fitness(predictedValues);
                    if (fitness < bestFitness)
                    {
                        bestFitness = fitness;
                        bestIndividual = individual;
                    }
                }

                //Debug.WriteLine($"Generation {generation + 1}, Best Fitness: {bestFitness}, Parameters: {string.Join(", ", bestIndividual)}");
            }

            Debug.WriteLine($"Genetic algorithm finished. Best Fitness: {bestFitness}, Params: {string.Join(", ", bestIndividual)}");

            return bestIndividual;
        }
    }
}