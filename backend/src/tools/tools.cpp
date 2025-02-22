#include "Tools.hpp"

#include <fstream>

namespace tools{

void parseString(
		const std::string& line,
		std::vector<std::string>& subStrings,
		char token){
	size_t start = 0;
	size_t end = 0;

	while (end != std::string::npos)
	{
		end = line.find(token, start);
		if ((end - start) > 0)
		{
			subStrings.push_back(line.substr(start, end - start));
		}
		start = end + 1;
	}
}

std::string readSingleLineFile(
		std::string filePath){	
	std::ifstream tableFile;
	tableFile.open(filePath);
	if (!tableFile.is_open())
		throw std::runtime_error("Unable to read the file");
	std::string line;
	getline(tableFile, line);
	return line;
}
}
