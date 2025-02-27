#include "data/table.hpp"
#include "tools/tools.hpp"

#include <nlohmann/json.hpp>

#include <iostream>
#include <fstream>
#include <sstream>

namespace table
{

using json = nlohmann::json;

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

Table::Table(const std::string& filePath)
{
	std::vector<std::string> subStrings;
	tools:tools::parseString(filePath, subStrings, '.');
	if (subStrings[subStrings.size()-1] == "json"
	 || subStrings[subStrings.size()-1] == "JSON")
	{
		initFromJson(filePath);
	}else if (subStrings[subStrings.size()-1] == "csv"
	 || subStrings[subStrings.size()-1] == "CSV")
	{
		std::cout<<"CSV"<<std::endl;
		initFromCSV(filePath);
	}
}

void Table::initFromJson(const std::string& filePath)
{
	std::ifstream tableFile;
	tableFile.open(filePath);
	if (!tableFile.is_open())
		throw std::runtime_error("Unable to read file with the table");

	json data = json::parse(tableFile);

	tableFile.close();

	if (data.size() == 0)
		return;

	for (auto& [key, value] : data[0].items())
	{
		m_columnNames.push_back(key);
	}

	for (auto& item : data)
	{
		for (auto& [key, value] : item.items())
		{
			if (value.is_number_float())
			{
				m_floatColumns[key].push_back(value);
			}else if (value.is_number_integer())
			{
				m_intColumns[key].push_back(value);
			}else
			{
				m_stringColumns[key].push_back(value);
			}
		}
	}

}

void Table::initFromCSV(const std::string& filePath)
{
	std::ifstream tableFile;
	tableFile.open(filePath);
	if (!tableFile.is_open())
		throw std::runtime_error("Unable to read file with the table");

	std::string line;
	getline(tableFile, line);
	// We need to read column names
	tools::parseString(line, m_columnNames, ',');

	while (getline(tableFile, line))
	{
		std::vector<std::string> parsedLine;
		tools::parseString(line, parsedLine, ',');
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

DataType Table::getColumnDataType(const std::string& columnName)
{
	if (m_floatColumns.contains(columnName))
		return DataType::Float;
	if (m_stringColumns.contains(columnName))
		return DataType::String;
	if (m_intColumns.contains(columnName))
		return DataType::Int;

	return DataType::Unsupported;
}

const std::vector<std::string>& Table::getStringColumnValues(const std::string& columnName, int start, int end) const
{
	if (!m_stringColumns.contains(columnName))
		throw std::logic_error("Column do not exist");

	return m_stringColumns.at(columnName);
}

const std::vector<float>& Table::getFloatColumnValues(const std::string& columnName, int start, int end) const
{
	if (!m_floatColumns.contains(columnName))
		throw std::logic_error("Column do not exist");

	return m_floatColumns.at(columnName);
}

const std::vector<int>& Table::getIntColumnValues(const std::string& columnName, int start, int end) const
{
	if (!m_intColumns.contains(columnName))
		throw std::logic_error("Column do not exist");

	return m_intColumns.at(columnName);
}
const float Table::getCellFloatValue(const std::string& columnName, int row) const
{
	return m_floatColumns.at(columnName)[row];
}
const int Table::getCellIntValue(const std::string& columnName, int row) const
{
	return m_intColumns.at(columnName)[row];
}
}
