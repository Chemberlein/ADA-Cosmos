#include "Computations.hpp"

#include <cmath>
using namespace table;
namespace computations
{
std::vector<float> computeLogReturns(const Table& t, const std::string& columnName)
{
	const std::vector<float>& values =  t.getFloatColumnValues(columnName);
	std::vector<float> resualt;
	for(auto i = 0; i<values.size()-1; i++)
	{
		resualt.push_back(std::log(values[i+1]/values[i]));
	}
	return resualt;
}
}
