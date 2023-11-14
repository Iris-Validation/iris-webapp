#include <clipper/clipper-ccp4.h>
#include <clipper/clipper-contrib.h>
#include <clipper/clipper-minimol.h>

struct ResidueResult {
    std::string name; 
    float value; 
    int seqnum;
    std::string metric;
};

struct ChainResult {
    std::string chain; 
    std::vector<ResidueResult> results;
};

struct ResultsBinding {
    std::vector<ChainResult> result;
    std::vector<std::string> chain_labels; 
};

struct AbstractMetric {
    virtual ResidueResult score(clipper::MMonomer &monomer) const = 0;
    int scale = 50;
};

struct AverageBFactorMetric: public AbstractMetric {
    ResidueResult score(clipper::MMonomer &monomer) const override ;
};

struct MaxBFactorMetric: public AbstractMetric {
    ResidueResult score(clipper::MMonomer &monomer) const override;
};

struct MainChainFit: public AbstractMetric {
    ResidueResult score(clipper::MMonomer& monomer) const override;
};

struct SideChainFit: public AbstractMetric {
    ResidueResult score(clipper::MMonomer& monomer) const override;
};

class CalculatedMetrics {
public:
    CalculatedMetrics(const std::string& path, std::vector<AbstractMetric*>& metrics);

    ResultsBinding calculate();

private:
    std::vector<AbstractMetric*> m_metrics;
    clipper::MiniMol m_mol;

};