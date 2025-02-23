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
		struct curl_slist* m_headers = nullptr;
		std::string m_url;

};
}
