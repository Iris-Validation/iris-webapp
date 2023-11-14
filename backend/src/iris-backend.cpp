#include "iris-backend.h"

ResidueResult AverageBFactorMetric::score(clipper::MMonomer &monomer) const {
    float total_bfac = 0.0f;
    for (int a = 0; a < monomer.size(); a++) {
        total_bfac += monomer[a].u_iso();
    }

    ResidueResult result;
    result.value = scale * total_bfac / monomer.size();
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = "Average B Factor";
    return result;
}

ResidueResult MaxBFactorMetric::score(clipper::MMonomer &monomer) const {
    float max = -1e9;
    for (int a = 0; a < monomer.size(); a++) {
        if (monomer[a].u_iso() > max) {
            max = monomer[a].u_iso();
        };
    }

    ResidueResult result;
    result.value = scale * max;
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = "Max B Factor";
    return result;
}

CalculatedMetrics::CalculatedMetrics(const std::string& path, std::vector<AbstractMetric*>& metrics) {
    m_metrics = metrics;

    clipper::MMDBfile mfile;
    clipper::MiniMol mol;
    mfile.read_file(path);
    mfile.import_minimol(mol);

    std::vector<std::string> aa_list = {
            "ALA", "ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "GLY", "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO",
            "SER", "THR", "TRP", "TYR", "VAL"};

    std::vector<std::string> chain_labels;

    clipper::MiniMol filtered_mol = {mol.spacegroup(), mol.cell()};
    for (int c = 0; c < mol.size(); c++) {
        clipper::MPolymer mp;
        mp.set_id(mol[c].id());
        for (int r = 0; r < mol[c].size(); r++) {
            if (std::find(aa_list.begin(), aa_list.end(), mol[c][r].type()) != aa_list.end()) {
                mp.insert(mol[c][r]);
            }
        }
        if (mp.size() > 0) {
            filtered_mol.insert(mp);
        }
    }
    m_mol = filtered_mol;
}

ResultsBinding CalculatedMetrics::calculate() {
    ResultsBinding binding;
    for (int c = 0; c < m_mol.size(); c++) {
        ChainResult chain_result;
        chain_result.chain = m_mol[c].id();
        for (int r = 0; r < m_mol[c].size(); r++) {
            for (AbstractMetric* ptr: m_metrics) {
                ResidueResult residue_result = ptr->score(m_mol[c][r]);
                chain_result.results.emplace_back(residue_result);
            }
        }
        binding.chain_labels.emplace_back(m_mol[c].id());
        binding.result.emplace_back(chain_result);
    }
    return binding;
}
