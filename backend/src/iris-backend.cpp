#include "iris-backend.h"

ResidueResult AverageBFactorMetric::score(clipper::MMonomer &monomer,
                                          clipper::Xmap<float> *xmap,
                                          clipper::MMonomer *previous_residue,
                                          clipper::MMonomer *next_residue) const
{
    float total_bfac = 0.0f;
    for (int a = 0; a < monomer.size(); a++)
    {
        total_bfac += monomer[a].u_iso();
    }

    ResidueResult result;
    result.value = scale * total_bfac / monomer.size();
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = get_name();
    result.type = get_type();
    return result;
}

ResidueResult MaxBFactorMetric::score(clipper::MMonomer &monomer,
                                      clipper::Xmap<float> *xmap,
                                      clipper::MMonomer *previous_residue,
                                      clipper::MMonomer *next_residue) const
{
    float max = -1e9;
    for (int a = 0; a < monomer.size(); a++)
    {
        if (monomer[a].u_iso() > max)
        {
            max = monomer[a].u_iso();
        };
    }

    ResidueResult result;
    result.value = scale * max;
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = get_name();
    result.type = get_type();

    return result;
}

ResidueResult MainChainFit::score(clipper::MMonomer &monomer,
                                  clipper::Xmap<float> *xmap,
                                  clipper::MMonomer *previous_residue,
                                  clipper::MMonomer *next_residue) const
{
    float score = 0;
    std::vector<std::string> main_chain_atoms = {"C", "CA", "N", "O", "OXT"};

    int atoms_found = 0;
    for (int a = 0; a < monomer.size(); a++)
    {
        if (std::find(main_chain_atoms.begin(), main_chain_atoms.end(), monomer[a].id().trim()) != main_chain_atoms.end())
        {
            clipper::Coord_frac frac = monomer[a].coord_orth().coord_frac(xmap->cell());
            score += xmap->interp<clipper::Interp_cubic>(frac);
            atoms_found++;
        }
    }

    float value = scale * score / atoms_found;
    if (atoms_found == 0)
    {
        value = 0;
    }
    ResidueResult result;
    result.value = value;
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = get_name();
    result.type = get_type();

    return result;
}

ResidueResult SideChainFit::score(clipper::MMonomer &monomer,
                                  clipper::Xmap<float> *xmap,
                                  clipper::MMonomer *previous_residue,
                                  clipper::MMonomer *next_residue) const
{
    float score = 0;

    std::vector<std::string> side_chain_atoms = {"CB", "CG", "CD", "CE", "NZ", "CZ", "CZ2", "CZ3", "NE", "NH1", "NH2",
                                                 "NE1", "CD1", "CD2", "CE1", "CE2", "CE3", "CH2", "OD1", "OD2", "OH"};

    int atoms_found = 0;
    for (int a = 0; a < monomer.size(); a++)
    {
        if (std::find(side_chain_atoms.begin(), side_chain_atoms.end(), monomer[a].id().trim()) != side_chain_atoms.end())
        {
            clipper::Coord_frac frac = monomer[a].coord_orth().coord_frac(xmap->cell());
            score += xmap->interp<clipper::Interp_cubic>(frac);
            atoms_found++;
        }
    }
    
    float value = scale * score / atoms_found;

    if (value >= 0.7 * scale) { 
        value = scale;
    }

    if (atoms_found == 0)
    {
        value = 0;
    }

    ResidueResult result;
    result.value = value;
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = get_name();
    result.type = get_type();

    return result;
}

float RamachandranMetric::calculate_probability(clipper::MMonomer &monomer, float phi, float psi) const
{

    std::string type = monomer.type();
    clipper::Ramachandran rama;
    rama.set_thresholds(0.02, 0.002);

    if (type == "GLY")
    {
        rama.init(clipper::Ramachandran::Gly2);
    }
    else if (type == "PRO")
    {
        rama.init(clipper::Ramachandran::Pro2);
    }
    else if (type == "ILE" || type == "VAL")
    {
        rama.init(clipper::Ramachandran::IleVal2);
    }
    else
    {
        rama.init(clipper::Ramachandran::NoGPIVpreP2);
    }

    return rama.probability(phi, psi);
}

ResidueResult RamachandranMetric::score(clipper::MMonomer &monomer,
                                        clipper::Xmap<float> *xmap,
                                        clipper::MMonomer *previous_residue,
                                        clipper::MMonomer *next_residue) const
{

    clipper::ftype phi = clipper::Util::nan();
    int phi_index_cx = previous_residue->lookup(" C  ", clipper::MM::ANY);
    int phi_index_n = monomer.lookup(" N  ", clipper::MM::ANY);
    int phi_index_ca = monomer.lookup(" CA ", clipper::MM::ANY);
    int phi_index_c = monomer.lookup(" C  ", clipper::MM::ANY);

    if (phi_index_cx >= 0 && phi_index_ca >= 0 && phi_index_c >= 0 && phi_index_n >= 0)
    {
        clipper::Coord_orth coord_cx = previous_residue->operator[](phi_index_cx).coord_orth();
        clipper::Coord_orth coord_n = monomer[phi_index_n].coord_orth();
        clipper::Coord_orth coord_ca = monomer[phi_index_ca].coord_orth();
        clipper::Coord_orth coord_c = monomer[phi_index_c].coord_orth();
        phi = clipper::Coord_orth::torsion(coord_cx, coord_n, coord_ca, coord_c);
    }

    clipper::ftype psi = clipper::Util::nan();
    int psi_index_n = monomer.lookup(" N  ", clipper::MM::ANY);
    int psi_index_ca = monomer.lookup(" CA ", clipper::MM::ANY);
    int psi_index_c = monomer.lookup(" C  ", clipper::MM::ANY);
    int psi_index_nx = next_residue->lookup(" N  ", clipper::MM::ANY);

    if (psi_index_ca >= 0 && psi_index_c >= 0 && psi_index_n >= 0 && psi_index_nx >= 0)
    {
        clipper::Coord_orth coord_n = monomer[psi_index_n].coord_orth();
        clipper::Coord_orth coord_ca = monomer[psi_index_ca].coord_orth();
        clipper::Coord_orth coord_c = monomer[psi_index_c].coord_orth();
        clipper::Coord_orth coord_nx = next_residue->operator[](psi_index_nx).coord_orth();
        psi = clipper::Coord_orth::torsion(coord_n, coord_ca, coord_c, coord_nx);
    }

    ResidueResult result;
    float probability = 0;
    if (clipper::Util::is_nan(phi) || clipper::Util::is_nan(psi))
    {
        result.value = -100;
    } else { 
        probability = scale * calculate_probability(monomer, phi, psi);
    }

    result.value = probability;
    result.name = monomer.type();
    result.seqnum = monomer.seqnum();
    result.metric = get_name();
    result.type = get_type();
    return result;
}

RunMode CalculatedMetrics::check_for_files()
{
    // Test for PDB
    bool found_pdb = false;
    bool found_mtz = false;
    bool found_map = false;

    std::ifstream pdb_file;
    pdb_file.open(m_pdb_path);
    if (pdb_file)
        found_pdb = true;
    pdb_file.close();

    std::ifstream mtz_file;
    mtz_file.open(m_mtz_path);
    if (mtz_file)
        found_mtz = true;
    mtz_file.close();

    std::ifstream map_file;
    map_file.open(m_map_path);
    if (map_file)
        found_map = true;
    map_file.close();

    if (found_pdb && !found_mtz && !found_map)
    {
        return RunMode::PDB;
    }
    else if (found_pdb && found_mtz && !found_map)
    {
        return RunMode::PDB_MTZ;
    }
    else if (found_pdb && found_map && !found_mtz)
    {
        return RunMode::PDB_MAP;
    }
    else
    {
        return RunMode::ERROR;
    }
}

void CalculatedMetrics::load_pdb()
{
    clipper::MMDBfile mfile;
    clipper::MiniMol mol;
    mfile.read_file(m_pdb_path);
    mfile.import_minimol(mol);

    std::vector<std::string> aa_list = {
        "ALA", "ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "GLY", "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO",
        "SER", "THR", "TRP", "TYR", "VAL"};

    std::vector<std::string> chain_labels;

    clipper::MiniMol filtered_mol = {mol.spacegroup(), mol.cell()};
    for (int c = 0; c < mol.size(); c++)
    {
        clipper::MPolymer mp;
        mp.set_id(mol[c].id());
        for (int r = 0; r < mol[c].size(); r++)
        {
            if (std::find(aa_list.begin(), aa_list.end(), mol[c][r].type()) != aa_list.end())
            {
                mp.insert(mol[c][r]);
            }
        }
        if (mp.size() > 0)
        {
            filtered_mol.insert(mp);
        }
    }
    m_mol = filtered_mol;
}

void CalculatedMetrics::load_mtz()
{
    clipper::HKL_info myhkl;
    clipper::MTZdataset myset;
    clipper::MTZcrystal myxtl;
    clipper::HKL_data<clipper::data32::F_phi> fphidata(myhkl, myxtl);

    clipper::CCP4MTZfile mtzin;
    mtzin.open_read("/input.mtz");
    mtzin.import_hkl_info(myhkl);
    mtzin.import_hkl_data(fphidata, myset, myxtl, "*/*/[FWT PHWT]");
    mtzin.close_read();

    clipper::Spacegroup cspg = myhkl.spacegroup();
    clipper::Cell cxtl = myhkl.cell();
    clipper::Grid_sampling grid(cspg, cxtl, myhkl.resolution());
    clipper::Xmap<float> xwrk(cspg, cxtl, grid);
    xwrk.fft_from(fphidata);

    m_xmap = xwrk;
}

void CalculatedMetrics::load_map()
{
    clipper::CCP4MAPfile file;
    file.open_read("/input.map");
    file.import_xmap(m_xmap);
    file.close_read();
}

CalculatedMetrics::CalculatedMetrics(std::vector<AbstractMetric *> &metrics)
{

    RunMode mode = check_for_files();
    if (mode == RunMode::ERROR)
    {
        throw std::runtime_error("A PDB file could not be found.");
    }

    load_pdb();

    if (mode == RunMode::PDB_MTZ)
        load_mtz();

    if (mode == RunMode::PDB_MAP)
        load_map();

    m_metrics = metrics;
}

bool CalculatedMetrics::check_for_continuous_residues(clipper::MPolymer &current_chain, int r)
{
    if (r < 1)
        return false;

    if (r >= current_chain.size() - 1)
    {
        return false;
    }

    clipper::MMonomer previous_residue = current_chain[r - 1];
    clipper::MMonomer current_residue = current_chain[r];
    clipper::MMonomer next_residue = current_chain[r + 1];

    int index_p_c = previous_residue.lookup(" C  ", clipper::MM::ANY);
    if (index_p_c < 0)
        return false;

    int index_c_n = current_residue.lookup(" N  ", clipper::MM::ANY);
    if (index_c_n < 0)
        return false;

    int index_c_c = current_residue.lookup(" C  ", clipper::MM::ANY);
    if (index_c_c < 0)
        return false;

    int index_n_n = next_residue.lookup(" N  ", clipper::MM::ANY);
    if (index_n_n < 0)
        return false;

    clipper::Coord_orth p_c = previous_residue[index_p_c].coord_orth();
    clipper::Coord_orth c_n = current_residue[index_c_n].coord_orth();
    clipper::Coord_orth c_c = current_residue[index_c_c].coord_orth();
    clipper::Coord_orth n_n = next_residue[index_n_n].coord_orth();

    const double n_c_dist = (c_n - p_c).lengthsq();
    const double c_n_dist = (n_n - c_c).lengthsq();

    if (n_c_dist >= 3 && c_n_dist >= 3)
        return true;
}

ResultsBinding CalculatedMetrics::calculate()
{
    ResultsBinding binding;
    for (int c = 0; c < m_mol.size(); c++)
    {
        ChainResult chain_result;
        chain_result.chain = m_mol[c].id();
        for (int r = 0; r < m_mol[c].size(); r++)
        {
            for (auto *ptr : m_metrics)
            {
                ResidueResult residue_result;

                if (ptr->get_use_surrounding_residues())
                {
                    if (!check_for_continuous_residues(m_mol[c], r))
                    {
                        continue;
                    }

                    residue_result = ptr->score(m_mol[c][r], &m_xmap, &m_mol[c][r - 1], &m_mol[c][r + 1]);
                }
                else
                {
                    residue_result = ptr->score(m_mol[c][r], &m_xmap);
                }
                chain_result.results.emplace_back(residue_result);
            }
        }
        binding.chain_labels.emplace_back(m_mol[c].id());
        binding.result.emplace_back(chain_result);
    }
    return binding;
}
