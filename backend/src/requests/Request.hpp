#pragma once

#include <curl/curl.h>

#include <string>
#include <nlohmann/json.hpp>

namespace requests{

class Request{
	public:
		Request(const std::string& endpoint);
		~Request();
		nlohmann::json get(const nlohmann::json& params);
	private:
		CURL* m_curl;
		struct curl_slist* m_headers = nullptr;
		std::string m_url;
		// Not used for the moment
		//std::size_t latsRequestTime;
		//nlohmann::json m_latParams;
		//nlohmann::json m_lastGetResponse;

};
}
