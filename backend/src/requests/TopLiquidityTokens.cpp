#include "TopLiquidityTokens.hpp"

#include <iostream>

namespace requests{

TopLiquidityTokens::TopLiquidityTokens(int nbOfTokens)
	: m_request("token/top/liquidity")
	, m_nbOfTokens(nbOfTokens)
{
	update();
}

void TopLiquidityTokens::update(){
	m_data.clear();

	nlohmann::json params;
	params["page"] = 1;
	params["perPage"] = m_nbOfTokens;
	nlohmann::json resualt = m_request.get(params);
	for ( auto item : resualt)
	{
		m_data[item["unit"]]=Token{.ticker = item["ticker"],.price = item["price"], .liquidity = item["liquidity"]};
	}
}

std::vector<std::string> TopLiquidityTokens::getVectorOfUnits(){
	std::vector<std::string> keys;
	for (auto [key, value] : m_data)
		keys.push_back(key);
	return keys;
}

std::string TopLiquidityTokens::getTicker(const std::string& unit){
	return m_data.at(unit).ticker;
}

float TopLiquidityTokens::getPrice(const std::string& unit){
	return m_data.at(unit).price;
}

float TopLiquidityTokens::getLiquidity(const std::string& unit){
	return m_data.at(unit).liquidity;
}

}
