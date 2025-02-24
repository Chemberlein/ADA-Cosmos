#include "TokenPriceOHLCV.hpp"

#include <iostream>
#include <math.h>

namespace requests{

TokenOHLC::TokenOHLC(const std::string& unit)
	: m_request("token/ohlcv")
	, m_unit(unit)
{
	update();
}

void TokenOHLC::update(){
	m_data.clear();

	nlohmann::json params;
	params["unit"] = m_unit;
	params["interval"] = "1d";
	params["numIntervals"] = 365;
	nlohmann::json resualt = m_request.get(params);

	for ( auto item : resualt)
	{
		m_data.push_back(
			OHLC{
				.time = item["time"],
				.volume = item["volume"],
				.open = item["open"],
				.high = item["high"],
				.low = item["low"],
				.close = item["close"]
			});
	}

	std::sort(m_data.begin(), m_data.end(), [](auto& a, auto& b) {
		return a.time < b.time;
	});

	float sumLogreturns = 0;
	for (auto i = 1; i < m_data.size(); i++)
	{
		float logReturn = std::log( ((m_data[i].high + m_data[i].low) * 0.5)
		                  / ((m_data[i - 1].high + m_data[i - 1].low) * 0.5));
		sumLogreturns += logReturn;

		m_avgLogReturnsOverTime.push_back(
		   std::make_pair(
			   m_data[i].time,
			   logReturn
			)
		);
	}
	m_avgLogReturn = sumLogreturns / (m_data.size() - 1);
}

std::vector<std::pair<std::size_t, float>> TokenOHLC::getAvgLogReturnsOverTime() const{
	return m_avgLogReturnsOverTime;
}

float TokenOHLC::getAverageLogReturn(){
	return m_avgLogReturn;
}

void TokenOHLC::printInCSVFormat()
{
	std::cout<< m_colNames[0]<<","<< m_colNames[1] <<","<< m_colNames[2]<<"," << m_colNames[3]<<"," << m_colNames[4]<<"," << m_colNames[5]<<std::endl;
	for (auto item : m_data)
	{
		std::cout<< item.time <<","<< item.volume <<","<< item.open <<"," << item.high <<"," << item.low <<"," << item.close <<std::endl;
	}
	std::cout<<std::endl;
}

}
