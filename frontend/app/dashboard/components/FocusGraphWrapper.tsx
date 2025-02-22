import dynamic from "next/dynamic";

const FocusGraph = dynamic(() => import("./FocusGraph"), {
	ssr: false,
});

export default function FocusGraphWrapper(props: { data: any }) {
	return(
		<div className="h-[100vh] w-full">
			<FocusGraph {...props} />
		</div>
	);
}