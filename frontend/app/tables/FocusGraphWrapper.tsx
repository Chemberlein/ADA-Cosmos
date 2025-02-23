import dynamic from "next/dynamic";

const CorilationPath = dynamic(() => import("./graph"), {
	ssr: false,
});

export default function FocusGraphWrapper() {
	return <CorilationPath />;
}