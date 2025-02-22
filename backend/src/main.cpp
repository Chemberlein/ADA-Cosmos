#include <iostream>
#include <string>
#include "data/Table.hpp"
#include "data/Computations.hpp"
#include <curl/curl.h>

using namespace table;
using namespace computations;

// Callback function to write received data to a string
size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
    size_t totalSize = size * nmemb;
    output->append(static_cast<char*>(contents), totalSize);
    return totalSize;
}
int main() {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;
    struct curl_slist* headers = nullptr;

    curl = curl_easy_init();
    if (curl) {
		// Set the URL (full URL with https://)
        curl_easy_setopt(curl, CURLOPT_URL, "https://openapi.taptools.io/api/v1/token/top/liquidity?page=1&perPage=100");

        // Set headers
        headers = curl_slist_append(headers, "x-api-key:"); // Replace with your API key
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // Set the write callback
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        // Perform the request
        res = curl_easy_perform(curl);

        // Handle the response
        if (res != CURLE_OK) {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        } else {
            std::cout << "Response:\n" << readBuffer << std::endl;
        }

        // Cleanup
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
	return 0;
}
/*
int main() {
	// First things first we want to load data
	Table t{"../data/TokenOHLC.csv"};
	std::string low = "Low";
	std::string time = "Time";
	std::string high = "High";
	std::string close = "Close";
	std::vector<float> lowLogReturns = computeLogReturns(t, low);
	std::vector<float> highLogReturns = computeLogReturns(t, high);
	std::vector<float> closeLogReturns = computeLogReturns(t, close);
	for (auto i = 0; i < lowLogReturns.size(); i++)
		std::cout<<t.getCellFloatValue(time, i+1)
		         <<","<<t.getCellFloatValue(low, i+1)
				 <<","<<lowLogReturns[i] 
				 <<","<<t.getCellFloatValue(high, i+1)
				 <<","<<highLogReturns[i] 
				 <<","<<t.getCellFloatValue(close, i+1)
				 <<","<<closeLogReturns[i] 
				 <<std::endl;
	return 0;
}
*/
