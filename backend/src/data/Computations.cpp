#include "Computations.hpp"
#include "requests/TopLiquidityTokens.hpp"
#include "requests/TokenPriceOHLCV.hpp"

#include <cmath>
#include <iostream>

using namespace table;
using namespace requests;
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

void generateLogReturnsGraph(){
	TopLiquidityTokens tokens(100);
	std::vector<std::string> tokensUnits = tokens.getVectorOfUnits();
	for (auto unit : tokensUnits){
		std::cout<<tokens.getTicker(unit)<<std::endl;
		TokenOHLC ohlc{unit};
		ohlc.printInCSVFormat();
	}
}

}
