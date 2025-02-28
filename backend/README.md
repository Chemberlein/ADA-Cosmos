# HUTA Backend

## Prerequisites

Before building the project, ensure you have the following dependencies installed:

- CMake (version 3.10 or higher)
- C++ compiler with C++17 support
- libcurl
- nlohmann-json

### Installing Dependencies

#### On macOS:
```bash
brew install cmake
brew install curl
brew install nlohmann-json
```

#### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install cmake
sudo apt-get install libcurl4-openssl-dev
sudo apt-get install nlohmann-json3-dev
```

## API Key Setup

1. Create a `.key` file in the project root directory
2. Add your Taptools API key to this file (single line)
```bash
echo "your-api-key-here" > .key
```

## Building the Project

1. Create a build directory and navigate to it:
```bash
mkdir build
cd build
```

2. Generate build files with CMake:
```bash
cmake ..
```

3. Build the project:
```bash
make
```

The compiled executable will be available in the `build` directory.

## Running the Program

After building, run the program from the project root directory:
```bash
./build/HUTA
```

## Program Output

The program will:
1. Generate correlation graph data in JSON format
2. Save the data to the specified output file  (../graphData/graphV2.json)
3. Automatically update the data every 24 hours


These JSON files can be used for graph generation and visualization of token correlations.

## Project Structure

```
backend/
├── include/          # Header files
├── src/             # Source files
├── build/           # Build directory (created during build)
├── .key             # API key file (needs to be created)
└── CMakeLists.txt   # CMake configuration file
```

## Troubleshooting

- If you get CURL-related errors, ensure libcurl is properly installed
- If you get JSON-related errors, verify nlohmann-json is correctly installed
- Make sure the `.key` file exists and contains a valid API key
