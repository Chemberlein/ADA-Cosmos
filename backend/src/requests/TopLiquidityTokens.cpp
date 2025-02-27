#include "requests/topLiquidityTokens.hpp"
#include <stdexcept>

namespace requests {

TopLiquidityTokens::TopLiquidityTokens(int nbOfTokens)
    : m_request("token/top/liquidity")
    , m_nbOfTokens(nbOfTokens) {
    if (nbOfTokens <= 0) {
        throw std::invalid_argument("Number of tokens must be positive");
    }
    update();
}

void TopLiquidityTokens::update() {
    m_data.clear();

    nlohmann::json params{
        {"page", 1},
        {"perPage", m_nbOfTokens}
    };

    try {
        const nlohmann::json result = m_request.get(params);
        
        for (const auto& item : result) {
            m_data.emplace(
                item["unit"].get<std::string>(),
                Token{
                    .ticker = item["ticker"],
                    .liquidity = item["liquidity"],
                    .price = item["price"]
                }
            );
        }
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to update token data: " + std::string(e.what()));
    }
}

std::vector<std::string> TopLiquidityTokens::getVectorOfUnits() {
    std::vector<std::string> units;
    units.reserve(m_data.size());
    
    for (const auto& [unit, _] : m_data) {
        units.push_back(unit);
    }
    return units;
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

} // namespace requests
