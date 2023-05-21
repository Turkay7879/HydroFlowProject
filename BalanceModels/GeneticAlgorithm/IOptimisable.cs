using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HydroFlowProject.BalanceModels.GeneticAlgorithm
{
    public interface IOptimisable
    {
        /// <summary>
        /// Objects inhereting from IOptimisable must implement this method and 
        /// return the number of parameters to be optimised. This determines the
        /// length of the double[] that the optimizer will use in calls to Fitness(..).
        /// </summary>
        /// <returns></returns>
        int NumberOfParameters();
        
        /// <summary>
        /// Objects inhereting from IOptimisable must return a fitness value for
        /// any given set of genes. Larger fitness values are taken to be better.
        /// </summary>
        /// <param name="genes"></param>
        /// <returns></returns>
        double Fitness(double[] normalizedParameters);

        /// <summary>
        /// Objects inhereting from IOptimisable must be clonable for parallelisation
        /// of the optimisation algorithm. The optimizer must be able to call 
        /// Fitness(double[] genes) on the clones without them interfering with 
        /// each other. If you intend to optimise single-threaded, you can include a
        /// dummy implementation of Clone (maybe just ahve it throw a 
        /// NotImplementedException).
        /// </summary>
        /// <returns></returns>
        Object DeepClone(); 
    }
}
