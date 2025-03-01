"use client";
import React from "react";
import { SocialIcon } from "react-social-icons";
import { Token } from "../types";

const DescriptionTab = ({ token }: { token: Token }) => (
	<div className="p-2">
		<p className="text-zinc-300 leading-relaxed mt-4">
			{token.socials.description || "No description available."}
		</p>
		<div className="space-y-2">
			{Object.entries(token.socials)
				.filter(([key, value]) => key !== "description" && value)
				.map(([key, value]) => (
					<div
						key={key}
						className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg"
					>
						<SocialIcon
							url={value || undefined}
							style={{ height: "48px", width: "48px" }}
							bgColor="#18181b"
						/>
						<div className="flex flex-col">
							<a
								href={value ?? "#"}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-blue-400 hover:underline"
							>
								<span className="text-zinc-100 capitalize">
									{key}
								</span>
							</a>
						</div>
					</div>
				))}
		</div>
	</div>
);

export default DescriptionTab;
