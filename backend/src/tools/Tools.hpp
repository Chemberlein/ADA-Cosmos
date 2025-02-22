#pragma once
#include <string>

namespace tools{
	
	void parseString(
			const std::string& line,
			std::vector<std::string>& subStrings,
			char token);

	std::string readSingleLineFile(
			std::string fileName);
}
