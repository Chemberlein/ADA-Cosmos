#include "Table.hpp"

#include <iostream>
#include <fstream>
#include <sstream>

namespace table
{

bool isFloat(const std::string& segment) {
    std::istringstream iss(segment);
    float f;
    iss >> f;
	return iss.eof() && !iss.fail();
}

bool isInt(const std::string& segment) {
    std::istringstream iss(segment);
    float f;
    iss >> f;
	return iss.eof() && !iss.fail();
}

void parseString(std::string& line, std::vector<std::string>& subStrings, char token)
{
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

Table::Table(const std::string& filePath)
{
	std::ifstream tableFile;
	tableFile.open(filePath);
	if (!tableFile.is_open())
		throw std::runtime_error("Unable to read file with the table");

	std::string line;
	getline(tableFile, line);
	// We need to read column names
	parseString(line, m_columnNames, ',');

	while (getline(tableFile, line))
	{
		std::vector<std::string> parsedLine;
		parseString(line, parsedLine, ',');
		for (auto i = 0; i<parsedLine.size(); i++)
		{
			if (isFloat(parsedLine[i]))
			{
				m_floatColumns[m_columnNames[i]].push_back(std::stof(parsedLine[i]));
			}else if (isInt(parsedLine[i]))
			{
				m_intColumns[m_columnNames[i]].push_back(std::stoi(parsedLine[i]));
			}else
			{
				m_stringColumns[m_columnNames[i]].push_back(parsedLine[i]);
			}
		}
	}

	tableFile.close();
}

int Table::getNbOfSamples() const
{
	return m_nbOfSamples;
}

DataType Table::getColumnDataType(std::string columnName)
{
	if (m_floatColumns.contains(columnName))
		return DataType::Float;
	if (m_stringColumns.contains(columnName))
		return DataType::String;
	if (m_intColumns.contains(columnName))
		return DataType::Int;

	return DataType::Unsupported;
}

const std::vector<std::string>& Table::getStringColumnValues(std::string columnName, int start, int end) const
{
	if (!m_stringColumns.contains(columnName))
		throw std::logic_error("Column do not exist");

	return m_stringColumns.at(columnName);
}

const std::vector<float>& Table::getFloatColumnValues(std::string columnName, int start, int end) const
{
	if (!m_floatColumns.contains(columnName))
		throw std::logic_error("Column do not exist");

	return m_floatColumns.at(columnName);
}

const std::vector<int>& Table::getIntColumnValues(std::string columnName, int start, int end) const
{
	if (!m_intColumns.contains(columnName))
		throw std::logic_error("Column do not exist");

	return m_intColumns.at(columnName);
}
}
