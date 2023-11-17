#include <emscripten/bind.h>
#include <emscripten.h>
#include <clipper/clipper-ccp4.h>
#include <clipper/clipper-contrib.h>
#include <clipper/clipper-minimol.h>

#include "iris-backend.h"
#include <iostream>

using namespace emscripten; 

ResultsBinding calculate() {

    AverageBFactorMetric* average_b_factor_metric = new AverageBFactorMetric;
    MaxBFactorMetric* max_b_factor_metric = new MaxBFactorMetric;
    MainChainFit* main_chain_fit_metric = new MainChainFit;
    SideChainFit* side_chain_fit_metric = new SideChainFit;
    RamachandranMetric* ramachandran_metric = new RamachandranMetric;

    std::vector<AbstractMetric*> metrics = {
            average_b_factor_metric,
            max_b_factor_metric,
            main_chain_fit_metric, 
            side_chain_fit_metric, 
            ramachandran_metric
    };

    CalculatedMetrics calculated_metrics = CalculatedMetrics(metrics);
    ResultsBinding results = calculated_metrics.calculate();

    delete average_b_factor_metric;
    delete max_b_factor_metric; 
    delete main_chain_fit_metric;
    delete side_chain_fit_metric;
    delete ramachandran_metric;
    return results;
}

EMSCRIPTEN_BINDINGS(iris_module) { 

  value_object<ResidueResult>("ResidueResults")
  .field("name", &ResidueResult::name)
  .field("value", &ResidueResult::value)
  .field("seqnum", &ResidueResult::seqnum)
  .field("metric", &ResidueResult::metric);

  register_vector<ResidueResult>("vector<ResidueResults>");

  value_object<ChainResult>("ChainResults")
  .field("chain", &ChainResult::chain)
  .field("results", &ChainResult::results);

  register_vector<ChainResult>("vector<ChainResults>");
  register_vector<std::string>("vector<std::string>");

  value_object<ResultsBinding>("ResultsBinding")
  .field("result", &ResultsBinding::result)
  .field("chain_labels", &ResultsBinding::chain_labels);

  function("test", &calculate);
}