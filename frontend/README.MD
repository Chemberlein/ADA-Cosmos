# API Call Structure Overview

Our project follows a modular approach to manage API calls, ensuring maintainability, type safety, and clear separation of concerns.

## 1. Proxy Layer

- **Location:** `frontend/app/api/taptoolsProxy/route.ts`
- **Purpose:**
  - **Intermediary:** Acts as a proxy between the frontend and the external TAPTOOLS API.
  - **CORS Management:** Handles CORS by setting the appropriate headers, allowing cross-origin requests.
  - **Security:** Appends the API key and other environment-specific settings.
  - **Request Forwarding:** Forwards requests to the actual API endpoint, preserving and appending query parameters.
  - **Error Handling:** Logs errors and returns consistent error responses.

## 2. Service Layer

- **Location:** `frontend/services/MarketTokensApiService.ts`
- **Purpose:**
  - **Encapsulation:** Wraps all API endpoints in a dedicated service class.
  - **Interface Implementation:** Implements the `IMarketTokensApi` interface to enforce a consistent API contract.
  - **Endpoint Methods:** Provides methods (e.g., `getActiveLoans`, `getTokenHolders`, etc.) that directly correspond to API endpoints.
  - **Generic Request Handler:** Uses a generic `request<T>` method to uniformly handle API calls, which:
    - Constructs the URL via the helper method `buildUrl`.
    - Sets headers (including the API key).
    - Parses and returns typed JSON responses.

## 3. Interfaces & Type Safety

- **Location:** `frontend/interfaces/tokens/` and `frontend/interfaces/IMarketTokensApi.ts`
- **Purpose:**
  - **Structured Data:** Defines clear TypeScript interfaces for the shape of API responses and request parameters (e.g., token loans, token holders, trades).
  - **Contract Enforcement:** The `IMarketTokensApi` interface outlines the methods and expected return types, ensuring any implementation adheres to the contract.
  - **Type Safety:** Reduces runtime errors by leveraging TypeScript’s static type checking, making the code more robust and maintainable.

## 4. Use of Generics

- **Where:** Inside the `MarketTokensApiService` class.
- **Purpose:**
  - **Flexibility:** The `request<T>` method uses generics to return the expected data type for different API calls.
  - **Reusability:** This approach avoids duplication, allowing a single method to handle various response types safely.
  - **Type Inference:** Ensures that each API method returns data matching the defined interfaces.

## 5. Frontend Integration Example

- **Location:** `frontend/app/dashboard/components/tokens.tsx`
- **Highlights:**
  - **Data Fetching:** Demonstrates how the `MarketTokensApiService` is instantiated and used to fetch data (e.g., Top Token Holders).
  - **State Management:** Uses React hooks (`useState`, `useEffect`) to manage API call states and error handling.
  - **Rendering:** Displays fetched data in a React component once it is loaded.
