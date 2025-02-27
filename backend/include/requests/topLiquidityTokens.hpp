#pragma once

#include "requests/request.hpp"
#include <nlohmann/json.hpp>
#include <string>
#include <vector>
#include <unordered_map>

namespace requests {

/**
 * Structure representing token information with its market data
 */
struct Token {
    std::string ticker; /**< Token ticker symbol */
    float liquidity;    /**< Token liquidity value */
    float price;        /**< Token current price */
};

/**
 * Class for managing and retrieving top liquidity tokens data
 */
class TopLiquidityTokens {
public:
    /**
     * Constructs TopLiquidityTokens object
     * @param nbOfTokens Number of top tokens to track
     */
    TopLiquidityTokens(int nbOfTokens);

    /**
     * Updates token information from the data source
     */
    void update();

    /**
     * Retrieves all available unit identifiers
     * @return Vector containing all unit identifiers
     */
    std::vector<std::string> getVectorOfUnits();

    /**
     * Gets the ticker symbol for a specific unit
     * @param unit Unit identifier to look up
     * @return Corresponding ticker symbol
     */
    std::string getTicker(const std::string& unit);

    /**
     * Gets the current price for a specific unit
     * @param unit Unit identifier to look up
     * @return Current price value
     */
    float getPrice(const std::string& unit);

    /**
     * Gets the liquidity for a specific unit
     * @param unit Unit identifier to look up
     * @return Liquidity value
     */
    float getLiquidity(const std::string& unit);

private:
    int m_nbOfTokens;
    Request m_request;
    std::unordered_map<std::string, struct Token> m_data;
    std::vector<std::string> m_colNames = {"liquidity", "price", "ticker", "unit"};
};
}
