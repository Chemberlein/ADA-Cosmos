"use client";
import React from "react";
import { Token } from "../types";

const TokenHeader = ({ token }: { token: Token }) => (
	<div className="flex items-start gap-4 border-b border-zinc-800 p-3 pt-1">
		<img
			src={"/placeholder.svg"}
			alt={token.ticker}
			className="w-12 h-12 rounded-lg object-cover"
		/>
		<div className="flex flex-col">
			<h2 className="text-xl font-semibold">{token.ticker}</h2>
			<p className="text-zinc-400">{"Token"}</p>
		</div>
	</div>
);

export default TokenHeader;
