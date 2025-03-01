"use client";
import React from "react";
import { SocialIcon } from "react-social-icons";
import { Token } from "../types";
import { ExternalLink } from "lucide-react";

const DescriptionTab = ({ token }: { token: Token }) => (
	<div className="p-4">
		{/* Description section with improved spacing and line height */}
		<div className="mb-6">
			<p className="text-zinc-300 leading-relaxed">
				{token.socials.description || "No description available."}
			</p>
		</div>

		{/* Social links section with 2-per-row grid layout */}
		<div className="space-y-3">
			<h3 className="text-sm font-medium text-zinc-400 mb-2">
				Social Links
			</h3>

			<div className="grid grid-cols-2 gap-3">
				{Object.entries(token.socials)
					.filter(([key, value]) => key !== "description" && value)
					.map(([key, value], index, array) => {
						// Check if this is the last item and there's an odd number of items
						const isLastAndOdd =
							index === array.length - 1 &&
							array.length % 2 === 1;

						return (
							<a
								key={key}
								href={value ?? "#"}
								target="_blank"
								rel="noopener noreferrer"
								className={`flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors duration-200 group ${
									isLastAndOdd ? "col-span-2" : ""
								}`}
							>
								{/* Social icon with consistent size and styling */}
								<div className="flex-shrink-0">
									<SocialIcon
										url={value || undefined}
										style={{ height: 32, width: 32 }}
										bgColor="transparent"
										fgColor="#d4d4d8"
										className="!w-8 !h-8"
									/>
								</div>

								{/* Link text with better hierarchy */}
								<div className="flex-grow">
									<span className="text-zinc-200 capitalize font-medium">
										{key}
									</span>
								</div>

								{/* External link icon that appears on hover */}
								<ExternalLink
									size={16}
									className="text-zinc-500 group-hover:text-amber-500 transition-colors duration-200"
								/>
							</a>
						);
					})}
			</div>

			{/* Empty state for when no social links are available */}
			{Object.entries(token.socials).filter(
				([key, value]) => key !== "description" && value
			).length === 0 && (
				<div className="text-center py-6 text-zinc-500">
					No social links available.
				</div>
			)}
		</div>
	</div>
);

export default DescriptionTab;
