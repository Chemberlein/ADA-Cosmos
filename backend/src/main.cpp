#include <iostream>
#include <string>
#include <stdexcept>
#include <chrono>
#include <thread>
#include <ctime>
#include "data/table.hpp"
#include "data/computations.hpp"

using namespace table;
using namespace computations;

constexpr auto ANALYSIS_INTERVAL = std::chrono::hours(24); // 1 day

std::string getCurrentTimestamp() {
    auto now = std::time(nullptr);
    auto* timestamp = std::localtime(&now);
    char buffer[80];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", timestamp);
    return std::string(buffer);
}

void runAnalysis() {
    try {
        std::cout << "[" << getCurrentTimestamp() << "] Starting log returns analysis...\n";
        generateLogReturnsGraph("../../graphData/graphV2.json");
        std::cout << "[" << getCurrentTimestamp() << "] Analysis completed successfully.\n";
    } catch (const std::exception& e) {
        std::cerr << "[" << getCurrentTimestamp() << "] Error during analysis: " << e.what() << std::endl;
        throw;
    }
}

int main() {
    std::cout << "Starting continuous analysis service (3-day interval)...\n";
    
    while (true) {
        try {
            runAnalysis();
            std::cout << "Sleeping for 3 days until next analysis...\n";
            std::this_thread::sleep_for(ANALYSIS_INTERVAL);
        } catch (const std::exception& e) {
            std::cerr << "Program encountered an error. Will retry in 24h.\n";
            std::this_thread::sleep_for(ANALYSIS_INTERVAL);
        }
    }
    
    return 0; // This line will never be reached
}
