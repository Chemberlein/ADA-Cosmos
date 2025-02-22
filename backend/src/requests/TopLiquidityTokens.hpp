#pragma once

#include "Request.hpp"

#include <nlohmann/json.hpp>

#include <string>
#include <vector>
#include <unordered_map>

namespace requests{
struct Token{
	std::string ticker;
	float liquidity;
	float price;
};

class TopLiquidityTokens{
	public:
		TopLiquidityTokens(int nbOfTokens);
		void update();
		std::vector<std::string> getVectorOfUnits();
		std::string getTicker(const std::string& unit);
		float getPrice(const std::string& unit);
		float getLiquidity(const std::string& unit);

	private:
		int m_nbOfTokens;
		Request m_request;
		std::unordered_map<std::string, struct Token> m_data;
		std::vector<std::string> m_colNames = {"liquidity", "price", "ticker", "unit"};
};
}
