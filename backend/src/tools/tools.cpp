#include "tools/tools.hpp"
#include <fstream>

namespace tools {

void parseString(
    const std::string& line,
    std::vector<std::string>& subStrings,
    char delimiter) 
{
    if (line.empty()) {
        return;
    }

    size_t start = 0;
    size_t end;

    while ((end = line.find(delimiter, start)) != std::string::npos) {
        subStrings.push_back(line.substr(start, end - start));
        start = end + 1;
    }

    // Add the last substring if there's remaining content
    if (start < line.length()) {
        subStrings.push_back(line.substr(start));
    }
}

std::string readSingleLineFile(const std::string& filePath) 
{
    std::ifstream file(filePath);
    if (!file.is_open()) {
        throw std::runtime_error("Unable to open file: " + filePath);
    }

    std::string line;
    if (!std::getline(file, line)) {
        throw std::runtime_error("File is empty: " + filePath);
    }

    return line;
}

} // namespace tools
