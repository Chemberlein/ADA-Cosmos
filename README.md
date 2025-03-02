# ADA-Cosmos

ADA-Cosmos is a full-stack application designed to visualize and analyze crypto token data on the Cardano blockchain. It offers real-time analytics, interactive 3D graphs, and comprehensive wallet exploration.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)

## Overview

ADA-Cosmos provides in-depth market analytics and visualization for tokens on the Cardano blockchain. The backend (in C++) handles token data aggregation and graph generation, while the frontend (built with Next.js and React) delivers an interactive dashboard experience.

## Features

- **Real-Time Visualization:** Interactive 3D graphs powered by [`TokensGraphClient`](frontend/app/(app)/dashboard/components/TokensGraphClient.tsx).
- **Market Analytics:** Displays token liquidity, price, and market capitalization using services like [`MarketTokensApiService`](frontend/services/MarketTokensApiService.ts).
- **Wallet Explorer:** Explore on-chain wallet data with dynamic UI components (e.g. [`WalletExplorer`](frontend/components/sidebar/walletExplorer/walletExplorer.tsx)).
- **Robust API Integration:** Implements a consistent API contract using TypeScript interfaces and generics.

## Project Structure
### Backend

- **Language:** C++ with CMake for build management.
- **Responsibilities:**
  - Fetching and processing token data (see [`topLiquidityTokens.cpp`](backend/src/requests/topLiquidityTokens.cpp) and [`tokenPriceOHLCV.cpp`](backend/src/requests/tokenPriceOHLCV.cpp)).
  - Generating graph datasets (see [`computatuions.cpp`](backend/src/data/computations.cpp))
- **Dependencies:** libcurl, nlohmann-json.
- **Configuration:** API keys should be placed in the `.key` file located inside the backend directory.

### Frontend

- **Framework:** Next.js & React.
- **Responsibilities:**
  - Providing an interactive dashboard.
  - Managing API calls and state using services like [`MarketTokensApiService`](frontend/services/MarketTokensApiService.ts) and context providers (see [`SelectedTokenContext`](frontend/contexts/SelectedTokenContext.tsx)).
- **Visualization:** Utilizes 3D force-directed graphs for token visualization ([`FocusGraph`](frontend/app/(app)/dashboard/components/FocusGraph.tsx)).


#### Backend:
- CMake (>=3.10)
- C++17 compatible compiler
- libcurl
- nlohmann-json

#### Frontend:
- Node.js (>=14)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd ADA-Cosmos

