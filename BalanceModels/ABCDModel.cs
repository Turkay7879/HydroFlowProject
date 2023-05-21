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

        public int NumberOfParameters()
        {
            return 4;
        }

        public ABCDModel()
        {
            InitialSt = 2.0;
            InitialGt = 2.0;
        }

        public void SetParams(Double a, Double b, Double c, Double d)
        {
            A = a;
            B = b;
            C = c;
            D = d;
        }

        public object DeepClone()
        {
            ABCDModel cloneModel = new()
            {
                A = A,
                B = B,
                C = C,
                D = D,
                InitialGt = InitialGt,
                InitialSt = InitialSt
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
            // Test
            var Qmodel = A + (B * 100) + C + D;
            return Qmodel;
        }
    }
}
