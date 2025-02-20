#pragma once
#include <unordered_map>
#include <vector>
#include <string>

namespace table {

// For now will support only int float and string values
enum class DataType {
	Unsupported = -1,
	String = 0,
	Int = 1,
	Float = 2
};

class Table
{
	public:
		Table(const std::string& filePath);
		int getNbOfSamples() const;
		DataType getColumnDataType(const std::string& columnName);
		const std::vector<std::string>& getStringColumnValues(const std::string& columnName, int start = 0, int end = -1) const;
		const std::vector<float>& getFloatColumnValues(const std::string& columnName, int start = 0, int end = -1) const;
		const std::vector<int>& getIntColumnValues(const std::string& columnName, int start = 0, int end = -1) const;
		const float getCellFloatValue(const std::string& columnName, int row) const;
		const int getCellIntValue(const std::string& columnName, int row) const;
	private:
		void initFromJson(const std::string& fileName);
		void initFromCSV(const std::string& fileName);
		int m_nbOfSamples;
		std::string m_filePath;
		std::vector<std::string> m_columnNames;
		std::unordered_map<std::string, std::vector<float>> m_floatColumns;
		std::unordered_map<std::string, std::vector<std::string>> m_stringColumns;
		std::unordered_map<std::string, std::vector<int>> m_intColumns;
};
}
