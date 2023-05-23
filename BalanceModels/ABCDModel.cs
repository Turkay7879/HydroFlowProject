using HydroFlowProject.BalanceModels.GeneticAlgorithm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HydroFlowProject.BalanceModels
{
    class ABCDModel : IOptimisable
    {
        private Double A;
        private Double B;
        private Double C;
        private Double D;
        private Double InitialSt;
        private Double InitialGt;

        private Double[] P;
        private Double[] PET;
        private Double[] Obsmm;

        public int NumberOfParameters()
        {
            return 4;
        }

        public ABCDModel(Double initialSt, Double initialGt)
        {
            InitialSt = initialSt;
            InitialGt = initialGt;
            P = Array.Empty<Double>();
            PET = Array.Empty<Double>();
            Obsmm = Array.Empty<Double>();
        }

        public void SetParams(Double a, Double b, Double c, Double d)
        {
            A = a;
            B = b;
            C = c;
            D = d;
        }

        public void SetDataSets(Double[] p, Double[] pet, Double[] obsmm)
        {
            P = p;
            PET = pet;
            Obsmm = obsmm;
        }

        public object DeepClone()
        {
            ABCDModel cloneModel = new(InitialSt, InitialGt)
            {
                A = A,
                B = B,
                C = C,
                D = D
            };
            return cloneModel;
        }

        public double Fitness(double[] genes)
        {
            SetParams(genes[0], genes[1], genes[2], genes[3]);
            return CalculatePredictions();
        }

        public double CalculatePredictions()
        {
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
                    W[i] = InitialSt + P[i];
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
                    G[i] = 1 / (1 + D) * (InitialGt + GR[i]);
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

            return Qmodel[0];
        }
    }
}
