#include "Computations.hpp"
#include "requests/TopLiquidityTokens.hpp"
#include "requests/TokenPriceOHLCV.hpp"

#include <cmath>
#include <iostream>
#include <algorithm>

using namespace table;
using namespace requests;
namespace computations
{
std::vector<float> computeLogReturns(const Table& t, const std::string& columnName)
{
	const std::vector<float>& values =  t.getFloatColumnValues(columnName);
	std::vector<float> resualt;
	for(auto i = 0; i<values.size()-1; i++)
	{
		resualt.push_back(std::log(values[i+1]/values[i]));
	}
	return resualt;
}

struct LogReturnsGraphNode
{
	std::string unit;
	std::string ticker;
	TokenOHLC   data;
};

struct LogReturnsGraphEdge
{
	std::string tickerA;
	std::string tickerB;
	float avarageCorilation;
};

void generateLogReturnsGraph(){
	TopLiquidityTokens tokens(100);
	std::vector<LogReturnsGraphNode> nodes;

	std::vector<std::string> tokensUnits = tokens.getVectorOfUnits();

	nlohmann::json nodesJ = nlohmann::json::array();
	for (auto unit : tokensUnits){

		TokenOHLC data{unit};
		nodes.push_back(
			LogReturnsGraphNode{
				.unit = unit,
				.ticker = tokens.getTicker(unit),
				.data = data
			}
		);
		nlohmann::json token;
		token["id"] = unit;
		token["name"] = tokens.getTicker(unit);
		token["price"] = tokens.getPrice(unit);
		token["liquidity"] = tokens.getLiquidity(unit);
		token["avgLogReturn"] = data.getAverageLogReturn();
		nodesJ.push_back(token);
	}
	
	nlohmann::json links = nlohmann::json::array();
	std::vector<LogReturnsGraphEdge> edges;
	for (auto nodeA : nodes){	
		for (auto nodeB : nodes){

			if (nodeA.ticker == nodeB.ticker)
				continue;

			std::vector<std::pair<std::size_t, float>> avgLROTA = nodeA.data.getAvgLogReturnsOverTime();
			std::vector<std::pair<std::size_t, float>> avgLROTB = nodeB.data.getAvgLogReturnsOverTime();
			std::size_t startA = 0;
			std::size_t startB = 0;
			std::size_t n = 0;

			if (avgLROTA.size() > avgLROTB.size()){
				while (startA < avgLROTA.size() && avgLROTA[startA].first < avgLROTB[0].first){
					startA++;
				}
			}else{
				while (startB < avgLROTB.size() && avgLROTB[startB].first < avgLROTA[0].first){
					startB++;
				}
			}
			float sumX = 0.0, sumY = 0.0, sumXY = 0.0, sumX2 = 0.0, sumY2 = 0.0;
			while (startB < avgLROTB.size() && startA < avgLROTA.size()){
				sumX += avgLROTA[startA].second;
				sumY += avgLROTB[startB].second;
				sumXY += avgLROTA[startA].second * avgLROTB[startB].second;
				sumX2 += avgLROTA[startA].second * avgLROTA[startA].second;
				sumY2 += avgLROTB[startB].second * avgLROTB[startB].second;

				startB++;	
				startA++;
				n++;
			}
			float numerator = n * sumXY - sumX * sumY;
			float denominator = std::sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

			float avarageCorilation = 0;
			if (denominator == 0.0) {
				avarageCorilation = 0.0; // Handle division by zero
			}

			avarageCorilation = numerator / denominator;

			edges.push_back(
				{
					.tickerA = nodeA.ticker,
					.tickerB = nodeB.ticker,
					.avarageCorilation = avarageCorilation
				}
			);
			nlohmann::json link;
			link["source"] = nodeA.unit;
			link["target"] = nodeB.unit;
			link["avarageCorilation"] = avarageCorilation;
			links.push_back(link);
		}
	}

	nlohmann::json resultOutput;
	resultOutput["nodes"] = nodesJ;
	resultOutput["links"] = links;
	std::cout<<resultOutput.dump(2)<<std::endl;

}

}
