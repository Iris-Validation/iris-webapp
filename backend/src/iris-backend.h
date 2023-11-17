#include <clipper/clipper-ccp4.h>
#include <clipper/clipper-contrib.h>
#include <clipper/clipper-minimol.h>
#include <clipper/clipper.h>

#include <fstream>

struct ResidueResult
{
    std::string name;
    float value;
    int seqnum;
    std::string metric;
};

struct ChainResult
{
    std::string chain;
    std::vector<ResidueResult> results;
};

struct ResultsBinding
{
    std::vector<ChainResult> result;
    std::vector<std::string> chain_labels;
};

struct AbstractMetric
{
    virtual ResidueResult score(clipper::MMonomer &monomer, clipper::Xmap<float> *xmap = nullptr) const = 0;
    virtual ResidueResult score(clipper::MMonomer &previous_residue,
                                clipper::MMonomer &monomer,
                                clipper::MMonomer &next_residue,
                                clipper::Xmap<float> *xmap = nullptr) const = 0;
    int scale = 50;
    bool use_surrounding_residues = false;
    virtual std::string get_name() = 0;
};

struct AverageBFactorMetric : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer, clipper::Xmap<float> *xmap = nullptr) const override;
    ResidueResult score(clipper::MMonomer &previous_residue,
                        clipper::MMonomer &monomer,
                        clipper::MMonomer &next_residue,
                        clipper::Xmap<float> *xmap = nullptr) const override {}
    std::string get_name() { return name; }

    std::string name = "Average B Factor";
};

struct MaxBFactorMetric : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer, clipper::Xmap<float> *xmap = nullptr) const override;
    ResidueResult score(clipper::MMonomer &previous_residue,
                        clipper::MMonomer &monomer,
                        clipper::MMonomer &next_residue,
                        clipper::Xmap<float> *xmap = nullptr) const override {}
    std::string get_name() { return name; }

    std::string name = "Max B Factor";
};

struct MainChainFit : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer, clipper::Xmap<float> *xmap = nullptr) const override;
    ResidueResult score(clipper::MMonomer &previous_residue,
                        clipper::MMonomer &monomer,
                        clipper::MMonomer &next_residue,
                        clipper::Xmap<float> *xmap = nullptr) const override {}
    int scale = 20;
    std::string get_name() { return name; }

    std::string name = "Main Chain Fit";
};

struct SideChainFit : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer, clipper::Xmap<float> *xmap = nullptr) const override;
    ResidueResult score(clipper::MMonomer &previous_residue,
                        clipper::MMonomer &monomer,
                        clipper::MMonomer &next_residue,
                        clipper::Xmap<float> *xmap = nullptr) const override {}
    int scale = 20;
    std::string get_name() { return name; }

    std::string name = "Side Chain Fit";
};

struct RamachandranMetric : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer, clipper::Xmap<float> *xmap = nullptr) const override {}
    ResidueResult score(clipper::MMonomer &previous_residue, clipper::MMonomer &monomer, clipper::MMonomer &next_residue, clipper::Xmap<float> *xmap = nullptr) const override;
    bool use_surrounding_residues = true;
    std::string get_name() { return name; }

    std::string name = "RamaMetric Fit";
};

enum RunMode
{
    PDB,
    PDB_MTZ,
    PDB_MAP,
    ERROR
};

class CalculatedMetrics
{
public:
    CalculatedMetrics(std::vector<AbstractMetric *> &metrics);

    ResultsBinding calculate();

private:
    RunMode check_for_files();
    bool check_for_continuous_residues(clipper::MPolymer &current_chain, int r);
    void load_pdb();
    void load_mtz();
    void load_map();

private:
    std::vector<AbstractMetric *> m_metrics;
    clipper::MiniMol m_mol;
    clipper::Xmap<float> m_xmap;

    std::string m_pdb_path = "/input.pdb";
    std::string m_mtz_path = "/input.mtz";
    std::string m_map_path = "/input.map";
};