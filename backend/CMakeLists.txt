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

# Update include directories
set(PROJECT_SOURCE_DIR "${CMAKE_SOURCE_DIR}/src")
set(PROJECT_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/include")

set(SOURCE_FILES
    src/data/computations.cpp
    src/data/table.cpp
    src/tools/tools.cpp
    src/requests/request.cpp
    src/requests/topLiquidityTokens.cpp
    src/requests/tokenPriceOHLCV.cpp
    src/main.cpp)

add_executable(HUTA ${SOURCE_FILES})

# Update include directories to use the new structure
target_include_directories(HUTA 
    PUBLIC 
        "${CMAKE_SOURCE_DIR}/include"
)

set_property(TARGET HUTA PROPERTY CXX_STANDARD 23)

# Add nlohman json
include(FetchContent)

FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz)
FetchContent_MakeAvailable(json)
find_package( CURL REQUIRED )
target_link_libraries(HUTA PRIVATE nlohmann_json::nlohmann_json CURL::libcurl )
