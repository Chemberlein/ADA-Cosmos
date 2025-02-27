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

/**
 *  Class representing a data table that can be loaded from various file formats
 */
class Table
{
	public:
		/**
		 *  Constructs a table from a file
		 * @param filePath Path to the input file (CSV or JSON)
		 */
		Table(const std::string& filePath);

		/**
		 *  Gets the number of samples/rows in the table
		 * @return Number of samples
		 */
		int getNbOfSamples() const;

		/**
		 *  Gets the data type of a specific column
		 * @param columnName Name of the column
		 * @return DataType enum value representing the column's data type
		 */
		DataType getColumnDataType(const std::string& columnName);

		/**
		 *  Gets string values from a column
		 * @param columnName Name of the column
		 * @param start Starting index (inclusive)
		 * @param end Ending index (exclusive), -1 means until the end
		 * @return Vector of string values
		 */
		const std::vector<std::string>& getStringColumnValues(const std::string& columnName, int start = 0, int end = -1) const;

		/**
		 *  Gets float values from a column
		 * @param columnName Name of the column
		 * @param start Starting index (inclusive)
		 * @param end Ending index (exclusive), -1 means until the end
		 * @return Vector of float values
		 */
		const std::vector<float>& getFloatColumnValues(const std::string& columnName, int start = 0, int end = -1) const;

		/**
		 *  Gets integer values from a column
		 * @param columnName Name of the column
		 * @param start Starting index (inclusive)
		 * @param end Ending index (exclusive), -1 means until the end
		 * @return Vector of integer values
		 */
		const std::vector<int>& getIntColumnValues(const std::string& columnName, int start = 0, int end = -1) const;

		/**
		 *  Gets a single float value from a specific cell
		 * @param columnName Name of the column
		 * @param row Row index
		 * @return Float value at the specified position
		 */
		const float getCellFloatValue(const std::string& columnName, int row) const;

		/**
		 *  Gets a single integer value from a specific cell
		 * @param columnName Name of the column
		 * @param row Row index
		 * @return Integer value at the specified position
		 */
		const int getCellIntValue(const std::string& columnName, int row) const;
	private:
		/**
		 *  Initializes table from a JSON file
		 * @param fileName Path to the JSON file
		 */
		void initFromJson(const std::string& fileName);

		/**
		 *  Initializes table from a CSV file
		 * @param fileName Path to the CSV file
		 */
		void initFromCSV(const std::string& fileName);

		int m_nbOfSamples;
		std::string m_filePath;
		std::vector<std::string> m_columnNames;
		std::unordered_map<std::string, std::vector<float>> m_floatColumns;
		std::unordered_map<std::string, std::vector<std::string>> m_stringColumns;
		std::unordered_map<std::string, std::vector<int>> m_intColumns;
};
}
