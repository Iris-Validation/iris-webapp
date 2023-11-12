#include <clipper/clipper-ccp4.h>
#include <clipper/clipper-contrib.h>
#include <clipper/clipper-minimol.h>

struct ResidueResults { 
    std::string name; 
    float value; 
};

struct ChainResults { 
    std::string chain; 
    std::vector<ResidueResults> results;
};

struct Results { 
    std::vector<ChainResults> result; 
};
 
struct MultiResults { 
    Results average_b_factor;
    Results max_b_factor; 
    std::vector<std::string> chain_labels; 
};
 

class Metric { 
public: 
    Metric(const std::string& path);

    Results calculate_average_b_factors();
    Results calculate_max_b_factors();

    std::vector<std::string> get_chain_labels(); 

private:

    float calculate_average_b_factor(clipper::MMonomer& monomer, int scale = 1);
    float calculate_max_b_factor(clipper::MMonomer& monomer, int scale = 1);

    clipper::MiniMol m_mol; 
};

