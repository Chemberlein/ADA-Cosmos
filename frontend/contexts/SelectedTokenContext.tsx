"use client";

import { TokenDataNode } from "@/app/dashboard/components/TokensGraphClient";
import React, { createContext, useState, useContext } from "react";

interface SelectedTokenContextType {
	selectedToken: TokenDataNode | null;
	setSelectedToken: React.Dispatch<
		React.SetStateAction<TokenDataNode | null>
	>;
}

const SelectedTokenContext = createContext<
	SelectedTokenContextType | undefined
>(undefined);

export const SelectedTokenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedToken, setSelectedToken] = useState<TokenDataNode | null>(
		null
	);
	const value = React.useMemo(
		() => ({ selectedToken, setSelectedToken }),
		[selectedToken]
	);
	return (
		<SelectedTokenContext.Provider value={value}>
			{children}
		</SelectedTokenContext.Provider>
	);
};

export const useSelectedToken = () => {
	const context = useContext(SelectedTokenContext);
	if (!context) {
		throw new Error(
			"useSelectedToken must be used within a SelectedTokenProvider"
		);
	}
	return context;
};
