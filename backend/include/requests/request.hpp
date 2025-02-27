#pragma once

#include <curl/curl.h>
#include "tools/tools.hpp"  // Update include path

#include <string>
#include <nlohmann/json.hpp>

/**
 * Namespace containing request-related functionality for API interactions
 */
namespace requests {

/**
 * Class for handling HTTP requests using libcurl
 */
class Request {
public:
    /**
     * Constructs Request object with specified endpoint
     * @param endpoint API endpoint URL
     */
    Request(const std::string& endpoint);

    /**
     * Destructor to cleanup CURL resources
     */
    ~Request();

    /**
     * Performs GET request with JSON parameters
     * @param params JSON parameters to include in the request
     * @return JSON response from the server
     */
    nlohmann::json get(const nlohmann::json& params);

private:
    struct curl_slist* m_headers = nullptr;
    std::string m_url;

};
}
