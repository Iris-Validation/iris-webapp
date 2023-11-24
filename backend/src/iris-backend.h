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
    std::string type;
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
    std::string file_name;
};

struct MultiResultsBinding
{
    std::vector<ResultsBinding> results;
};

struct AbstractMetric
{
    virtual ResidueResult score(clipper::MMonomer &monomer,
                                clipper::Xmap<float> *xmap = nullptr,
                                clipper::MMonomer *previous_residue = nullptr,
                                clipper::MMonomer *next_residue = nullptr) const = 0;
    int scale = 50;
    virtual bool get_use_surrounding_residues() const = 0;
    virtual std::string get_name() const = 0;
    virtual std::string get_type() const = 0;
    virtual bool requires_map() const = 0;
};

struct AverageBFactorMetric : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer,
                        clipper::Xmap<float> *xmap = nullptr,
                        clipper::MMonomer *previous_residue = nullptr,
                        clipper::MMonomer *next_residue = nullptr) const override;

    bool get_use_surrounding_residues() const { return false; }

    std::string get_name() const { return "Average B Factor"; }
    std::string get_type() const { return "continuous"; }
    bool requires_map() const { return false; }
};

struct MaxBFactorMetric : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer,
                        clipper::Xmap<float> *xmap = nullptr,
                        clipper::MMonomer *previous_residue = nullptr,
                        clipper::MMonomer *next_residue = nullptr) const override;

    bool get_use_surrounding_residues() const { return false; }
    std::string get_name() const { return "Max B Factor"; }
    std::string get_type() const { return "continuous"; }
    bool requires_map() const { return false; }
};

struct MainChainFit : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer,
                        clipper::Xmap<float> *xmap = nullptr,
                        clipper::MMonomer *previous_residue = nullptr,
                        clipper::MMonomer *next_residue = nullptr) const override;
    int scale = 20;
    bool get_use_surrounding_residues() const { return false; }
    std::string get_name() const { return "Main Chain Fit"; }
    std::string get_type() const { return "continuous"; }
    bool requires_map() const { return true; }
};

struct SideChainFit : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer,
                        clipper::Xmap<float> *xmap = nullptr,
                        clipper::MMonomer *previous_residue = nullptr,
                        clipper::MMonomer *next_residue = nullptr) const override;
    int scale = 20;
    bool get_use_surrounding_residues() const { return false; }
    std::string get_name() const { return "Side Chain Fit"; }
    std::string get_type() const { return "continuous"; }
    bool requires_map() const { return true; }
};

struct RamachandranMetric : public AbstractMetric
{
    ResidueResult score(clipper::MMonomer &monomer,
                        clipper::Xmap<float> *xmap = nullptr,
                        clipper::MMonomer *previous_residue = nullptr,
                        clipper::MMonomer *next_residue = nullptr) const override;

    float calculate_probability(clipper::MMonomer &monomer, float phi, float psi) const;

    int scale = 10;
    bool get_use_surrounding_residues() const { return true; }
    std::string get_name() const { return "Ramachandran"; }
    std::string get_type() const { return "continuous"; }
    bool requires_map() const { return false; }
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
    CalculatedMetrics(std::vector<AbstractMetric *> &metrics, const std::string &pdb_path);

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

    RunMode m_mode;

    std::string m_pdb_path;
    std::string m_mtz_path = "/input.mtz";
    std::string m_map_path = "/input.map";
};