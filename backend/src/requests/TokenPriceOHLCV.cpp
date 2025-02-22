#include "TokenPriceOHLCV.hpp"

#include <iostream>

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
		m_data.push_back(OHLC{.time = item["time"], .volume = item["volume"],.open = item["open"],.high = item["high"],.low = item["low"],.close = item["close"]});
	}
	// Then we should sort vector over time btw
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
