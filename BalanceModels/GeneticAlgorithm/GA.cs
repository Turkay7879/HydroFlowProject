using System;
using System.Collections;
using System.IO;
using Amib.Threading;
using Optimera;

namespace HydroFlowProject.BalanceModels.GeneticAlgorithm
{
    public class GA
    {
        #region [ Private properties ]

        private static Random m_random = new Random();
        private IOptimisable[] m_models = new IOptimisable[] { null };
        private double m_mutationRate;
        private double m_crossoverRate;
        private int m_populationSize;
        //private int m_generationSize;
        private int m_genomeSize;
        private double m_rouletteWheelSize;
        private bool m_elitism;
        private int m_thisGenerationNumber;
        private ArrayList m_thisGeneration;
        private ArrayList m_nextGeneration;
        private ArrayList m_fitnessTable;
        private ArrayList m_bestFitnesses;
        private int m_logicalCores;
        private ObjectDispatcher m_modelDispatcher;
        private SmartThreadPool m_stp;
        private ProgressReporterDelegate m_progressReporter;
        private int m_terminationGenerations;
        private double m_terminationThreshold;

        #endregion [ Private properties ]


        #region [ Public setters and getters ]

        /// <summary>
        /// Get/set a delegate for reporting progress during the 
        /// optimization run.
        /// </summary>
        public delegate void ProgressReporterDelegate(String[] s);
        public ProgressReporterDelegate ProgressReporter
        {
            get
            {
                return m_progressReporter;
            }
            set
            {
                m_progressReporter = value;
            }
        }

        /// <summary>
        /// Get/set the termination criteria: the number of 
        /// generations used to assess stability.
        /// </summary>
        public int TerminationGenerations
        {
            get
            {
                return m_terminationGenerations;
            }
            set
            {
                m_terminationGenerations = value;
            }
        }

        /// <summary>
        /// Get/set the termination criteria: the maximum 
        /// </summary>
        public double TerminationThreshold
        {
            get
            {
                return m_terminationThreshold;
            }
            set
            {
                m_terminationThreshold = value;
            }
        }

        /// <summary>
        /// Get/set the model that is to be calibrated.
        /// </summary>
        public IOptimisable Model
        {
            get
            {
                if (m_models == null || m_models.Length < 1) return null;
                return m_models[0];
            }
            set
            {
                if (value != null) GenomeSize = value.NumberOfParameters();
                m_models[0] = value;

                RebuildModelResources();
            }
        }

        /// <summary>
        /// Get/set the number of threads to use.
        /// </summary>
        public int NumberOfThreads
        {
            get
            {
                return m_logicalCores;
            }
            set
            {
                m_logicalCores = value;
                RebuildModelResources();
                m_stp = new SmartThreadPool(60000, m_logicalCores, m_logicalCores);
            }
        }

        /// <summary>
        /// Get/set the size of the population.
        /// </summary>
        public int PopulationSize
        {
            get
            {
                return m_populationSize;
            }
            set
            {
                m_populationSize = value;
            }
        }

        ///// <summary>
        ///// Get/set the number of geneations.
        ///// </summary>
        //public int Generations
        //{
        //    get
        //    {
        //        return m_generationSize;
        //    }
        //    set
        //    {
        //        m_generationSize = value;
        //    }
        //}

        /// <summary>
        /// Get/set the length of the genome.
        /// </summary>
        public int GenomeSize
        {
            get
            {
                return m_genomeSize;
            }
            set
            {
                m_genomeSize = value;
            }
        }

        /// <summary>
        /// Get/set the crossover rate [default = 0.8].
        /// </summary>
        public double CrossoverRate
        {
            get
            {
                return m_crossoverRate;
            }
            set
            {
                m_crossoverRate = value;
            }
        }

        /// <summary>
        /// Get set the mutation rate [default = 0.05].
        /// </summary>
        public double MutationRate
        {
            get
            {
                return m_mutationRate;
            }
            set
            {
                m_mutationRate = value;
            }
        }

        /// <summary>
        /// Keep previous generation's fittest individual in place of worst in current
        /// </summary>
        public bool Elitism
        {
            get
            {
                return m_elitism;
            }
            set
            {
                m_elitism = value;
            }
        }

        #endregion [ Public setters and getters ]


        /// <summary>
        /// Re-populates the model dispatcher with clones of the model to be
        /// used on different threads. This should be called if you change
        /// the model, or if you change the number of threads.
        /// </summary>
        private void RebuildModelResources()
        {
            //Remember the model we want to clone
            IOptimisable oldModel = m_models[0];

            //Resize the array
            m_models = new IOptimisable[m_logicalCores];
            m_models[0] = oldModel;
            if (m_models[0] != null)
                for (int i = 1; i < m_logicalCores; i++)
                    m_models[i] = (IOptimisable)m_models[0].DeepClone();

            //Create a new ObjectDispatcher fitted with the model resources
            m_modelDispatcher = new ObjectDispatcher(m_models);
        }



        /// <summary>
        /// Default constructor. Initializes the evolutionary parameters with default 
        /// values.
        /// </summary>
        public GA()
        {
            DefaultValues();
        }


        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="crossoverRate"></param>
        /// <param name="mutationRate"></param>
        /// <param name="populationSize"></param>
        /// <param name="generationSize"></param>
		public GA(IOptimisable model, double crossoverRate, double mutationRate, int populationSize)
        {
            DefaultValues();
            Model = model;
            MutationRate = mutationRate;
            CrossoverRate = crossoverRate;
            PopulationSize = populationSize;
        }


        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="n_threads"></param>
        /// <param name="crossoverRate"></param>
        /// <param name="mutationRate"></param>
        /// <param name="populationSize"></param>
        /// <param name="generationSize"></param>
        /// <param name="genomeSize"></param>
        public GA(IOptimisable model, Int32 n_threads, double crossoverRate, double mutationRate, int populationSize)
        {
            DefaultValues();
            Model = model;
            NumberOfThreads = n_threads;
            MutationRate = mutationRate;
            CrossoverRate = crossoverRate;
            PopulationSize = populationSize;
        }


        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="progressReporter"></param>
        /// <param name="n_threads"></param>
        /// <param name="crossoverRate"></param>
        /// <param name="mutationRate"></param>
        /// <param name="populationSize"></param>
        /// <param name="generationSize"></param>
        /// <param name="genomeSize"></param>
        public GA(IOptimisable model, ProgressReporterDelegate progressReporter,
            Int32 n_threads, double crossoverRate, double mutationRate, int populationSize,
            int terminationGenerations, double terminationThreshold)
        {
            DefaultValues();
            Model = model;
            ProgressReporter = progressReporter;
            NumberOfThreads = n_threads;
            MutationRate = mutationRate;
            CrossoverRate = crossoverRate;
            PopulationSize = populationSize;
            TerminationGenerations = terminationGenerations;
            TerminationThreshold = terminationThreshold;
        }


        /// <summary>
        /// Sets default values for the evolutionary parameters.
        /// </summary>
		public void DefaultValues()
        {
            NumberOfThreads = 1;
            GenomeSize = -1;
            Model = null;
            Elitism = true;
            MutationRate = 0.05;
            CrossoverRate = 0.80;
            PopulationSize = 100;
            TerminationGenerations = 5;
            TerminationThreshold = 0.01;
        }


        /// <summary>
        /// Method which starts the GA executing.
        /// </summary>
        public void Go()
        {
            m_thisGenerationNumber = 0;

            //
            if (m_genomeSize == 0)
                throw new IndexOutOfRangeException("Genome size not set");

            // Create the fitness table.
            m_fitnessTable = new ArrayList();
            m_thisGeneration = new ArrayList();
            m_nextGeneration = new ArrayList();
            m_bestFitnesses = new ArrayList();
            //m_thisGeneration = new ArrayList(m_generationSize);
            //m_nextGeneration = new ArrayList(m_generationSize);
            Genome.MutationRate = m_mutationRate;

            //
            CreateGenomes();
            RankPopulation();

            //
            Boolean TerminationCriteriaMet = false;
            //for (int i = 0; i < m_generationSize; i++)
            int i = -1;
            while (TerminationCriteriaMet == false)
            {
                i++; //i=0 in the first iteration.
                m_thisGenerationNumber = i + 1;

                CreateNextGeneration();
                RankPopulation();

                //Assess the convergence criteria
                Genome best = (Genome)m_thisGeneration[m_populationSize - 1];
                m_bestFitnesses.Add(best.Fitness);
                if (i >= m_terminationGenerations)
                {
                    Double F1 = (double)m_bestFitnesses[i - m_terminationGenerations];
                    Double F2 = best.Fitness;
                    Double convergence = (F2 - F1) / Math.Abs(F1);
                    if (Double.IsNaN(convergence) || convergence < m_terminationThreshold)
                    {
                        TerminationCriteriaMet = true;
                    }
                }

                //Do progress reporting if required
                if (m_progressReporter != null)
                {
                    //Create report string
                    String[] s = new String[5];
                    s[0] = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.ffff");
                    s[1] = (i + 1).ToString();
                    s[2] = ((i + 1) * m_populationSize).ToString();
                    s[3] = best.Fitness.ToString();
                    Double[] bestGenes = best.Genes();
                    for (int j = 0; j < best.Length; j++)
                        s[4] += (bestGenes[j].ToString() + " ");

                    //Send report
                    m_progressReporter(s);
                }
            }
        }


        /// <summary>
        /// After ranking all the genomes by fitness, use a 'roulette wheel' selection
        /// method. This allocates a large probability of selection to those with the 
        /// highest fitness.
        /// </summary>
        /// <returns>Index of individual randomly chosen biased towards highest fitness</returns>
        private int RouletteSelection()
        {
            int idx = -1;
            int first = 0;
            int last = m_populationSize - 1;

            if (m_rouletteWheelSize > 0d)
            {
                //ArrayList's BinarySearch is for exact values only so do this by hand.
                //Note that the below code assumes that the roulette wheel is positive.
                double randomFitness = m_random.NextDouble() * m_rouletteWheelSize;
                int mid = (last - first) / 2;
                while (idx == -1 && first <= last)
                {
                    if (randomFitness < (double)m_fitnessTable[mid])
                    {
                        last = mid;
                    }
                    else if (randomFitness > (double)m_fitnessTable[mid])
                    {
                        first = mid;
                    }
                    mid = (first + last) / 2;
                    if ((last - first) == 1)
                        idx = last;
                }
            }
            else
            {
                //The roulette wheel can have zero size when all members contian
                //the same fitness. I.e. the population is degenerate or homogenous.
                //In this case roulette selection should just be totally random.
                idx = m_random.Next(last);
            }

            return idx;
        }


        /// <summary>
        /// Rank population and sort in order of fitness.
        /// </summary>
        private void RankPopulation()
        {
            //Now I have a population of size "m_populationSize" for whom
            //I need to calculate fitnesses. This can be done using a simple
            //single-threaded loop, or by using a thread-pool design if 
            //multiple cores are available. I've implemented both options:
            Genome[] genomes = new Genome[m_populationSize];
            for (int i = 0; i < m_populationSize; i++)
                genomes[i] = ((Genome)m_thisGeneration[i]);

            if (m_logicalCores == 1)
            {
                //Single threaded design
                for (int i = 0; i < m_populationSize; i++)
                    genomes[i].Fitness = m_models[0].Fitness(genomes[i].Genes());
            }
            else
            {
                //Multiple threaded design

                //Queue all the jobs
                IWaitableResult[] results = new IWaitableResult[m_populationSize];
                for (int i = 0; i < m_populationSize; i++)
                    results[i] = m_stp.QueueWorkItem(new WorkItemCallback(DoWork), ((Genome)m_thisGeneration[i]));

                //Wait for all jobs to be done
                SmartThreadPool.WaitAll(results);
            }

            //Sort in order of fitness.
            m_thisGeneration.Sort(new GenomeComparer());

            //Now construct the roulette wheel for parental selection.
            //Conventionally, the size of each section of the roulette wheel is proportional
            //to the fitness. This requires some modification to work for negative fitnesses
            //so I have changed it so that the size of each section is proportional to 
            //(fitness - worst_fitness). One side-effect of this is that the worst genome gets 
            //a size of 0, and will therefore never be selected as for parenthood. Another is
            //that the method will fail if the population becomes degenerate.
            double worst_fitness = ((Genome)m_thisGeneration[0]).Fitness; //minimum fitness in generation
            m_fitnessTable.Clear();
            m_rouletteWheelSize = 0d;
            for (int i = 0; i < m_populationSize; i++)
            {
                double fitness = ((Genome)m_thisGeneration[i]).Fitness;
                double section_size = (fitness - worst_fitness); //section size = (fitness - worst fitness).
                m_rouletteWheelSize += section_size;             //cumulative section sizes.
                m_fitnessTable.Add((double)m_rouletteWheelSize); //store cumulative section sizes in a table for later use in the RouletteSelection() method.
            }
        }


        /// <summary>
        /// Used in multi-threaded mode to calculate the fitness of a Genome.
        /// </summary>
        /// <param name="genome"></param>
        /// <returns></returns>
        private object DoWork(object genome)
        {
            //Borrow a model from the dispatcher
            IOptimisable model = (IOptimisable)m_modelDispatcher.Borrow();

            //Run the model
            Genome G = (Genome)genome;
            G.Fitness = model.Fitness(G.Genes());

            //Return the model to the dispatcher
            m_modelDispatcher.Return(model);

            //Return a result (actually not being used) 
            //except maybe to notify that the thread has finished
            //return G.Fitness;
            return null;
        }


        /// <summary>
        /// Create the *initial* genomes by repeated calling the supplied fitness function
        /// </summary>
        private void CreateGenomes()
        {
            for (int i = 0; i < m_populationSize; i++)
            {
                Genome g = new Genome(m_genomeSize);
                m_thisGeneration.Add(g);
            }
        }


        /// <summary>
        /// Creates a new generation of Genomes using evolutionary processes: parent selection, 
        /// gene crossover, random mutation, elitsm.
        /// </summary>
		private void CreateNextGeneration()
        {
            m_nextGeneration.Clear();

            //ArrayList lastGeneration = new ArrayList();
            //for (int i = 0 ; i < m_populationSize; i++)
            //    lastGeneration.Add(((Genome) m_thisGeneration[i]).DeepClone());            


            //Breed next gen
            for (int i = 0; i < m_populationSize; i += 2)
            {
                int pidx1 = RouletteSelection();
                int pidx2 = RouletteSelection();
                Genome parent1, parent2, child1, child2;
                parent1 = ((Genome)m_thisGeneration[pidx1]).DeepClone();
                parent2 = ((Genome)m_thisGeneration[pidx2]).DeepClone();

                if (m_random.NextDouble() < m_crossoverRate)
                {
                    parent1.Crossover(ref parent2, out child1, out child2);
                }
                else
                {
                    child1 = parent1;
                    child2 = parent2;
                }
                child1.Mutate();
                child2.Mutate();

                m_nextGeneration.Add(child1);
                m_nextGeneration.Add(child2);
            }

            //Do elitism
            if (m_elitism)
            {
                Genome best = ((Genome)m_thisGeneration[m_populationSize - 1]);
                m_nextGeneration[0] = best.DeepClone();
            }

            //Move the next generation to this generation
            m_thisGeneration.Clear();
            for (int i = 0; i < m_populationSize; i++)
                m_thisGeneration.Add(m_nextGeneration[i]);
        }


        /// <summary>
        /// Gets the fittest Genome and returns its genes (as a double array) and its fitness.
        /// </summary>
        /// <param name="values"></param>
        /// <param name="fitness"></param>
		public void GetBest(out double[] values, out double fitness)
        {
            Genome g = ((Genome)m_thisGeneration[m_populationSize - 1]);
            values = new double[g.Length];
            g.GetValues(ref values);
            fitness = (double)g.Fitness;
        }


        /// <summary>
        /// Gets the least fit Genome and returns its genes (as a double array) and its fitness.
        /// </summary>
        /// <param name="values"></param>
        /// <param name="fitness"></param>
		public void GetWorst(out double[] values, out double fitness)
        {
            GetNthGenome(0, out values, out fitness);
        }


        /// <summary>
        /// Gets the nth Genome and returns its genes and fitness. Genomes are already ranked
        /// from worst (n=0) to best (n=populationsize - 1).
        /// </summary>
        /// <param name="n"></param>
        /// <param name="values"></param>
        /// <param name="fitness"></param>
		public void GetNthGenome(int n, out double[] values, out double fitness)
        {
            if (n < 0 || n > m_populationSize - 1)
                throw new ArgumentOutOfRangeException("n too large, or too small");
            Genome g = ((Genome)m_thisGeneration[n]);
            values = new double[g.Length];
            g.GetValues(ref values);
            fitness = (double)g.Fitness;
        }
    }
}
