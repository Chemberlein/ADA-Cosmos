#pragma once

#include "Request.hpp"

#include <nlohmann/json.hpp>

#include <string>
#include <vector>
#include <unordered_map>
#include <utility>

namespace requests{
struct OHLC{
	std::size_t time;
	float volume;
	float open;
	float high;
	float low;
	float close;
};

class TokenOHLC{
	public:
		TokenOHLC(const std::string& unit);
		void update();
		std::vector<std::pair<std::size_t, float>> getAvgLogReturnsOverTime() const;
		void printInCSVFormat();
		float getAverageLogReturn();
	private:
		Request m_request;
		std::string m_unit;
		std::vector<struct OHLC> m_data;
		std::vector<std::string> m_colNames = {"time", "volume", "open", "high", "low", "close"};
		// We may assume that time always in incrementing order
		std::vector<std::pair<std::size_t, float>> m_avgLogReturnsOverTime;
		float m_avgLogReturn = 0;
};
}
