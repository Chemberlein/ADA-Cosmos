#include "requests/tokenPriceOHLCV.hpp"
#include <algorithm>
#include <stdexcept>

namespace requests {

TokenOHLC::TokenOHLC(const std::string& unit)
    : m_request("token/ohlcv")
    , m_unit(unit) {
    update();
}

void TokenOHLC::update() {
    m_data.clear();
    m_avgLogReturnsOverTime.clear();

    nlohmann::json params{
        {"unit", m_unit},
        {"interval", "12h"},
        {"numIntervals", 1000}
    };

    try {
        const nlohmann::json result = m_request.get(params);
        m_data.reserve(result.size());

        for (const auto& item : result) {
            m_data.push_back(OHLC{
                .time = item["time"],
                .volume = item["volume"],
                .open = item["open"],
                .high = item["high"],
                .low = item["low"],
                .close = item["close"]
            });
        }

        std::sort(m_data.begin(), m_data.end(), 
            [](const auto& a, const auto& b) { return a.time < b.time; });

        calculateLogReturns();
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to update token data: " + std::string(e.what()));
    }
}

void TokenOHLC::calculateLogReturns() {
    if (m_data.size() < 2) {
        return;
    }

    float sumLogReturns = 0.0f;
    m_avgLogReturnsOverTime.reserve(m_data.size() - 1);

    for (size_t i = 1; i < m_data.size(); ++i) {
        const float prevAvgPrice = (m_data[i-1].high + m_data[i-1].low) * 0.5f;
        const float currAvgPrice = (m_data[i].high + m_data[i].low) * 0.5f;
        
        const float logReturn = std::log(currAvgPrice / prevAvgPrice);
        sumLogReturns += logReturn;

        m_avgLogReturnsOverTime.emplace_back(m_data[i].time, logReturn);
    }

    m_avgLogReturn = sumLogReturns / (m_data.size() - 1);
}

std::vector<std::pair<std::size_t, float>> TokenOHLC::getAvgLogReturnsOverTime() const {
    return m_avgLogReturnsOverTime;
}

float TokenOHLC::getAverageLogReturn() {
    return m_avgLogReturn;
}

} // namespace requests
