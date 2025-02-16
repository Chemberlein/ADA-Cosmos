#include <iostream>
#include <string>
#include "data/Table.hpp"
#include "data/Computations.hpp"

using namespace table;
using namespace computations;

int main() {
	// First things first we want to load data
	Table t{"../data/data.csv"};
	std::string columnName = "Real Price";
	std::vector<float> logReturns = computeLogReturns(t, columnName);
	for (auto f: logReturns)
		std::cout<<f<<std::endl;
	return 0;
}
