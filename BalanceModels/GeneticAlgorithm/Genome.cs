using System;
using System.Collections;

namespace HydroFlowProject.BalanceModels.GeneticAlgorithm
{
    public class Genome
    {
        public double[] m_genes;
        public static Random m_random = new Random();

        private static double m_mutationRate;
        private int m_length;
        private double m_fitness;




        /// <summary>
        /// Creates an uninitialized Genome.
        /// </summary>        
        public Genome()
        {
        }

        /// <summary>
        /// Creates a new Genome with a specified length.
        /// </summary>
        /// <param name="length"></param>
        public Genome(int length)
        {
            m_length = length;
            m_genes = new double[length];
            RandomizeGenes();
        }

        /// <summary>
        /// Creates a new Genome of a specified length, and initializes
        /// it with random values.
        /// </summary>
        /// <param name="length"></param>
        /// <param name="randomizeGenes"></param>
		public Genome(int length, bool randomizeGenes)
        {
            m_length = length;
            m_genes = new double[length];
            if (randomizeGenes)
                RandomizeGenes();
        }

        /// <summary>
        /// Creates a new Genome which is a clone of the specified Genome.
        /// </summary>
        /// <param name="genes"></param>
		public Genome(ref double[] genes)
        {
            m_length = genes.GetLength(0);
            m_genes = new double[m_length];
            for (int i = 0; i < m_length; i++)
                m_genes[i] = genes[i];
        }

        /// <summary>
        /// Randomizes all the Genomes genes to new values between 0 and 1.
        /// </summary>
        private void RandomizeGenes()
        {
            for (int i = 0; i < m_length; i++)
                m_genes[i] = m_random.NextDouble();
        }

        /// <summary>
        /// Performs a crossover between this Genome, and another (specified in the 1st argument),
        /// to produce two children (the 2nd and 3rd arguments).
        /// </summary>
        /// <param name="genome2"></param>
        /// <param name="child1"></param>
        /// <param name="child2"></param>
		public void Crossover(ref Genome genome2, out Genome child1, out Genome child2)
        {
            int pos = (int)(m_random.NextDouble() * (double)m_length);
            child1 = new Genome(m_length, false);
            child2 = new Genome(m_length, false);
            for (int i = 0; i < m_length; i++)
            {
                if (i < pos)
                {
                    child1.m_genes[i] = m_genes[i];
                    child2.m_genes[i] = genome2.m_genes[i];
                }
                else
                {
                    child1.m_genes[i] = genome2.m_genes[i];
                    child2.m_genes[i] = m_genes[i];
                }
            }
        }


        /// <summary>
        /// Mutates the Genome. Genes randomly chosen for mutation will be averaged 
        /// with a new random value between 0 and 1. On average this will tends to 
        /// mutate genes towards 0.5.
        /// </summary>
		public void Mutate()
        {
            for (int pos = 0; pos < m_length; pos++)
            {
                if (m_random.NextDouble() < m_mutationRate)
                    m_genes[pos] = (m_genes[pos] + m_random.NextDouble()) / 2.0;
            }
        }


        /// <summary>
        /// Returns the genes in a double array.
        /// </summary>
        /// <returns></returns>
		public double[] Genes()
        {
            return m_genes;
        }


        ///// <summary>
        ///// Writes the Genome to the console.
        ///// </summary>
        //public void Output()
        //{
        //    for (int i = 0 ; i < m_length ; i++)
        //    {
        //        System.Console.WriteLine("{0:F4}", m_genes[i]);
        //    }
        //    System.Console.Write("\n");
        //}


        /// <summary>
        /// Copies the values of the genes into a new double array (specified in the 1st arguemnt).
        /// The is assumed to already be initialized with the correct length.
        /// </summary>
        /// <param name="values"></param>
		public void GetValues(ref double[] values)
        {
            for (int i = 0; i < m_length; i++)
                values[i] = m_genes[i];
        }


        /// <summary>
        /// Get/set the fitness of this Genome.
        /// </summary>
		public double Fitness
        {
            get
            {
                return m_fitness;
            }
            set
            {
                m_fitness = value;
            }
        }



        /// <summary>
        /// Get/set the mutation rate. A value of 0.05 or lower 
        /// is recommended.
        /// </summary>
		public static double MutationRate
        {
            get
            {
                return m_mutationRate;
            }
            set
            {
                if (value < 0) throw new ArgumentOutOfRangeException("Cant have a mutation rate less than 0.");
                if (value > 1) throw new ArgumentOutOfRangeException("Cant have a mutation rate greater than 1.");
                m_mutationRate = value;
            }
        }


        /// <summary>
        /// Returns the length of the Genome.
        /// </summary>
		public int Length
        {
            get
            {
                return m_length;
            }
        }


        /// <summary>
        /// Returns a deep clone.
        /// </summary>
        /// <returns></returns>
        public Genome DeepClone()
        {
            Genome clone = new Genome(m_length, false);
            for (int i = 0; i < m_length; i++) clone.m_genes[i] = m_genes[i];
            clone.Fitness = Fitness;
            return clone;
        }
    }
}
