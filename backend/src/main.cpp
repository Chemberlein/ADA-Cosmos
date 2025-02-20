#include <iostream>
#include <string>
#include "data/Table.hpp"
#include "data/Computations.hpp"

using namespace table;
using namespace computations;

int main() {
	// First things first we want to load data
	Table t{"../data/TokenOHLC.csv"};
	std::string low = "Low";
	std::string time = "Time";
	std::string high = "High";
	std::string close = "Close";
	std::vector<float> lowLogReturns = computeLogReturns(t, low);
	std::vector<float> highLogReturns = computeLogReturns(t, high);
	std::vector<float> closeLogReturns = computeLogReturns(t, close);
	for (auto i = 0; i < lowLogReturns.size(); i++)
		std::cout<<t.getCellFloatValue(time, i+1)
		         <<","<<t.getCellFloatValue(low, i+1)
				 <<","<<lowLogReturns[i] 
				 <<","<<t.getCellFloatValue(high, i+1)
				 <<","<<highLogReturns[i] 
				 <<","<<t.getCellFloatValue(close, i+1)
				 <<","<<closeLogReturns[i] 
				 <<std::endl;
	return 0;
}
