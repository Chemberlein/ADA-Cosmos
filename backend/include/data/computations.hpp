#pragma once
#include "table.hpp"
#include "tools/tools.hpp"

#include <vector>
#include <string>

namespace computations
{
/**
 *  Computes logarithmic returns from a column of values
 * @param t Source data table
 * @param columnName Name of the column to process
 * @return Vector of computed log returns
 */
std::vector<float> computeLogReturns(
		const table::Table& t,
		const std::string& columnName);

/**
 *  Generates data for graph visualization of log returns
 * @param filePath Path to the output CSV file
 */
void generateLogReturnsGraph(std::string filePath);
}
