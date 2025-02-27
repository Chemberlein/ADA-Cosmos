#pragma once

#include "requests/request.hpp"

#include <nlohmann/json.hpp>

#include <string>
#include <vector>
#include <unordered_map>
#include <utility>

namespace requests {

/**
 * Structure representing OHLC (Open, High, Low, Close) market data
 */
struct OHLC {
    std::size_t time;  /**< Timestamp of the data point */
    float volume;      /**< Trading volume */
    float open;        /**< Opening price */
    float high;        /**< Highest price */
    float low;         /**< Lowest price */
    float close;       /**< Closing price */
};

/**
 * Class for managing token OHLC data and calculating statistics
 */
class TokenOHLC {
public:
    /**
     * Constructs TokenOHLC object for a specific token
     * @param unit Token unit identifier
     */
    TokenOHLC(const std::string& unit);

    /**
     * Updates OHLC data from the data source
     */
    void update();

    /**
     * Calculates and returns average logarithmic returns over time
     * @return Vector of pairs containing timestamp and average log return
     */
    std::vector<std::pair<std::size_t, float>> getAvgLogReturnsOverTime() const;

    /**
     * Calculates the average logarithmic return
     * @return Average log return value
     */
    float getAverageLogReturn();

private:
    Request m_request;
    std::string m_unit;
    std::vector<struct OHLC> m_data;
    std::vector<std::string> m_colNames = {"time", "volume", "open", "high", "low", "close"};
    // We may assume that time always in incrementing order
    std::vector<std::pair<std::size_t, float>> m_avgLogReturnsOverTime;

    void calculateLogReturns();
    float m_avgLogReturn = 0;
};
}
