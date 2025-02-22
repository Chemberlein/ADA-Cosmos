cmake_minimum_required(VERSION 3.22.1)
project(HUTA)
set(CMAKE_MODULE_PATH               "${CMAKE_CURRENT_SOURCE_DIR}/cmake")
set(CMAKE_CXX_FLAGS_DEBUG           "${CMAKE_CXX_FLAGS_DEBUG} -Og -ggdb")
set(CMAKE_CXX_FLAGS_RELEASE         "${CMAKE_CXX_FLAGS_RELEASE} -DNDEBUG -O3 -flto")
set(CMAKE_INCLUDE_SYSTEM_FLAG_CXX   "-isystem ")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY  "${CMAKE_CURRENT_SOURCE_DIR}/build")


if(CMAKE_SYSTEM_NAME STREQUAL Darwin)
    set(CMAKE_CXX_FLAGS_DEBUG       "${CMAKE_CXX_FLAGS_DEBUG} -save-temps=obj")
endif()
set(PROJECT_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/src")

set(SOURCE_FILES
	src/data/Computations.cpp
	src/data/Computations.hpp
	src/data/Table.cpp
	src/data/Table.hpp
	src/tools/Tools.hpp
	src/tools/Tools.cpp
	src/requests/Request.hpp
	src/requests/Request.cpp
	src/requests/TopLiquidityTokens.hpp
	src/requests/TopLiquidityTokens.cpp
	src/requests/TokenPriceOHLCV.cpp
	src/requests/TokenPriceOHLCV.hpp
    src/main.cpp)

add_executable(HUTA ${SOURCE_FILES})
target_include_directories(HUTA PUBLIC "${PROJECT_INCLUDE_DIR}")

set_property(TARGET HUTA PROPERTY CXX_STANDARD 23)
# Add nlohman json
include(FetchContent)

FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz)
FetchContent_MakeAvailable(json)
find_package( CURL REQUIRED )
target_link_libraries(HUTA PRIVATE nlohmann_json::nlohmann_json CURL::libcurl )
