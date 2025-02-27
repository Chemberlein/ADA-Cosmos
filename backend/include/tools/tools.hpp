#ifndef TOOLS_HPP
#define TOOLS_HPP

#include <string>
#include <vector>
#include <stdexcept>

namespace tools {

/**
 * Splits a string into substrings based on a delimiter token
 * @param line String to parse
 * @param subStrings Vector to store resulting substrings
 * @param delimiter Character to use as delimiter
 */
void parseString(
    const std::string& line,
    std::vector<std::string>& subStrings,
    char delimiter);

/**
 * Reads first line from a file
 * @param filePath Path to the file
 * @return Content of the first line
 * @throws std::runtime_error if file cannot be opened or is empty
 */
std::string readSingleLineFile(const std::string& filePath);

} // namespace tools

#endif // TOOLS_HPP
