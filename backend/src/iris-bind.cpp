#include <emscripten/bind.h>
#include <emscripten.h>
#include <clipper/clipper-ccp4.h>
#include <clipper/clipper-contrib.h>
#include <clipper/clipper-minimol.h>

#include "iris-backend.h"

using namespace emscripten; 


MultiResults calculate() { 
  Metric metric = Metric("/5fjj.pdb");
  Results avg_b_factor = metric.calculate_average_b_factors(50);
  Results max_b_factor = metric.calculate_max_b_factors(50);

  MultiResults results;
  results.average_b_factor = avg_b_factor; 
  results.max_b_factor = max_b_factor;

  results.chain_labels = metric.get_chain_labels();

  return results;
}

EMSCRIPTEN_BINDINGS(iris_module) { 

  value_object<ResidueResults>("ResidueResults")
  .field("name", &ResidueResults::name)
  .field("value", &ResidueResults::value);

  register_vector<ResidueResults>("vector<ResidueResults>");

  value_object<ChainResults>("ChainResults")
  .field("chain", &ChainResults::chain)
  .field("results", &ChainResults::results);

  register_vector<ChainResults>("vector<ChainResults>");

  value_object<Results>("Results")
  .field("result", &Results::result);

  register_vector<std::string>("vector<std::string>");

  value_object<MultiResults>("MultiResults")
  .field("average_b_factor", &MultiResults::average_b_factor)
  .field("max_b_factor", &MultiResults::max_b_factor)
  .field("chain_labels", &MultiResults::chain_labels);

  function("test", &calculate);
}