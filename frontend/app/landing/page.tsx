import {
	ClerkLoading,
	ClerkLoaded,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Link from "next/link";
import HalftoneWaves from "./components/halftone-waves";
import Image from "next/image";

export default function LandingPage() {
	return (
		<div className="relative w-full h-screen bg-black text-white overflow-hidden">
			<header className="absolute top-0 left-0 right-0 z-10 p-4">
				<nav className="flex justify-between items-center max-w-6xl mx-auto pt-2">
					<div className="flex items-center">
						<Image
							src="/adak.png"
							alt="logo"
							width={50}
							height={50}
						/>
						<span className="text-3xl font-bold pl-3">
							ADA Kosmos
						</span>
					</div>
					<ul className="flex space-x-6 text-2xl">
						<li>
							<Link
								href="/dashboard"
								className="hover:text-gray-300"
							>
								Home
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:text-gray-300">
								Features
							</Link>
						</li>
						<li>
							<ClerkLoading>
								<Loader className="h-5 w-5 text-muted-foreground animate-spin" />
							</ClerkLoading>
							<ClerkLoaded>
								<SignedIn>
									<UserButton />
								</SignedIn>
								<SignedOut>
									<SignInButton mode="modal">
										<p className="hover:text-gray-300 hover:cursor-pointer">
											Sign-in
										</p>
									</SignInButton>
								</SignedOut>
							</ClerkLoaded>
						</li>
					</ul>
				</nav>
			</header>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
				<div>
					<h1 className="text-5xl font-bold mb-8 max-w-4xl mx-auto inset-shadow-lg">
						Uncover{" "}
						<span className="text-[#0033AD] text-6xl">Hidden</span>{" "}
						Structures inside Cardano Ecosystem
					</h1>
					<ClerkLoading>
						<Loader className="h-5 w-5 text-muted-foreground animate-spin" />
					</ClerkLoading>
					<ClerkLoaded>
						<SignedIn>
							<Link href="/dashboard">
								<button className="bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
									Dashboard
								</button>
							</Link>
						</SignedIn>
						<SignedOut>
							<SignInButton mode="modal">
								<button className="bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
									Get Started
								</button>
							</SignInButton>
						</SignedOut>
					</ClerkLoaded>
				</div>
			</div>
			<HalftoneWaves />
		</div>
	);
}
