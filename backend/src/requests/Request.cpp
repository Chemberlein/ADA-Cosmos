#include "Request.hpp"
#include "tools/Tools.hpp"

#include <iostream>
#include <string>
#include <algorithm>

namespace requests{
// Callback function to write received data to a string
size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
    size_t totalSize = size * nmemb;
    output->append(static_cast<char*>(contents), totalSize);
    return totalSize;
}

std::string paramsToUrlFormat(const nlohmann::json& params){
	std::string urlFormatParams = "?";
	for (auto it = params.begin(); it != params.end(); it++){
		urlFormatParams += it.key();
		urlFormatParams += "=";
		urlFormatParams += it.value().dump();
		urlFormatParams += "&";
	}
	urlFormatParams.pop_back();
	urlFormatParams.erase(
			std::remove(
				urlFormatParams.begin(),
				urlFormatParams.end(),
				'"'),
			urlFormatParams.end());
	return urlFormatParams;
}

Request::Request(const std::string& endpoint){
	std::string key = tools::readSingleLineFile("../.key"); // Path to the file with api Key
	std::string keyParam = "x-api-key: "+key;
    m_headers = curl_slist_append(m_headers, keyParam.c_str());
	m_url = "https://openapi.taptools.io/api/v1/" + endpoint;
    m_curl = curl_easy_init();
	if (!m_curl)
		throw std::runtime_error("Faild to init curl");
}

Request::~Request(){
	curl_slist_free_all(m_headers);
	curl_easy_cleanup(m_curl);
}

nlohmann::json Request::get(const nlohmann::json& params){
    CURLcode res;
	std::string request = m_url + paramsToUrlFormat(params);
    std::string readBuffer;
	curl_easy_setopt(m_curl, CURLOPT_URL, request.c_str());

	// Set headers
	curl_easy_setopt(m_curl, CURLOPT_HTTPHEADER, m_headers);

	// Set the write callback
	curl_easy_setopt(m_curl, CURLOPT_WRITEFUNCTION, WriteCallback);
	curl_easy_setopt(m_curl, CURLOPT_WRITEDATA, &readBuffer);

	// Perform the request
	res = curl_easy_perform(m_curl);

	// Handle the response
	if (res != CURLE_OK) {
		std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
		throw std::runtime_error("Curl failed");
	}
	return  nlohmann::json::parse(readBuffer);
}
}
