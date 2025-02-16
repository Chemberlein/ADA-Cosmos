#pragma once
#include "Table.hpp"

#include <vector>
#include <string>

namespace computations
{
std::vector<float> computeLogReturns(
		const table::Table& t,
		const std::string& columnName);
}
