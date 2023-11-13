#include "iris-backend.h"

Metric::Metric(const std::string &path)
{
    clipper::MMDBfile mfile;
    clipper::MiniMol mol;
    mfile.read_file(path);
    mfile.import_minimol(mol);

    std::vector<std::string> aa_list = {
        "ALA", "ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "GLY", "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO", "SER", "THR", "TRP", "TYR", "VAL"};

    std::vector<std::string> chain_labels;

    clipper::MiniMol filtered_mol = {mol.spacegroup(), mol.cell()}; 
    for (int c = 0; c < mol.size(); c++) {
        clipper::MPolymer mp;
        mp.set_id(mol[c].id()) ;
        for (int r = 0; r < mol[c].size(); r++) {
            if (std::find(aa_list.begin(), aa_list.end(), mol[c][r].type()) != aa_list.end())
            {
                mp.insert(mol[c][r]);
            }
        }
       if (mp.size() > 0) { 
        filtered_mol.insert(mp);
       }
    }


    m_mol = filtered_mol;
}

float Metric::calculate_average_b_factor(clipper::MMonomer &monomer, int scale)
{
    float total_bfac = 0.0f;
    for (int a = 0; a < monomer.size(); a++)
    {
        total_bfac += monomer[a].u_iso();
    }
    return scale * total_bfac / monomer.size();
}

Results Metric::calculate_average_b_factors(int scale)
{
    clipper::MModel m_model = m_mol.model();

    Results results;
    for (int c = 0; c < m_model.size(); c++)
    {
        ChainResults chain_results;
        chain_results.chain = m_model[c].id();

        for (int r = 0; r < m_model[c].size(); r++)
        {
            clipper::MMonomer monomer = m_model[c][r];

            if (monomer.type() == "HOH") {
                continue;
            }

            float average_b_factor = calculate_average_b_factor(monomer, scale);
            ResidueResults residue_data;
            residue_data.name = monomer.type();
            residue_data.value = average_b_factor;

            chain_results.results.emplace_back(residue_data);
        }

        results.result.emplace_back(chain_results);
    }

    return results;
}

float Metric::calculate_max_b_factor(clipper::MMonomer &monomer, int scale)
{
    float max = -1e9;
    for (int a = 0; a < monomer.size(); a++)
    {
        if (monomer[a].u_iso() > max)
        {
            max = monomer[a].u_iso();
        };
    }
    return scale * max;
}

Results Metric::calculate_max_b_factors(int scale)
{
    clipper::MModel m_model = m_mol.model();

    Results results;
    for (int c = 0; c < m_model.size(); c++)
    {
        ChainResults chain_results;
        chain_results.chain = m_model[c].id();

        for (int r = 0; r < m_model[c].size(); r++)
        {

            clipper::MMonomer monomer = m_model[c][r];

            if (monomer.type() == "HOH")
            {
                continue;
            }

            float max_b_factor = calculate_max_b_factor(monomer, scale);
            ResidueResults residue_data;
            residue_data.name = monomer.type();
            residue_data.value = max_b_factor;

            chain_results.results.emplace_back(residue_data);
        }

        results.result.emplace_back(chain_results);
    }

    return results;
}

std::vector<std::string> Metric::get_chain_labels()
{
    clipper::MModel m_model = m_mol.model();

    std::vector<std::string> aa_list = {
        "ALA", "ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "GLY", "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO", "SER", "THR", "TRP", "TYR", "VAL"};

    std::vector<std::string> chain_labels;
    for (int c = 0; c < m_model.size(); c++)
    {
        for (int r = 0; r < m_model[c].size(); r++)
        {
            if (std::find(aa_list.begin(), aa_list.end(), m_model[c][r].type()) != aa_list.end())
            {
                chain_labels.emplace_back(m_model[c].id());
                break;
            }
        }
    }

    return chain_labels;
}
