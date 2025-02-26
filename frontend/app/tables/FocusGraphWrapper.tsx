import dynamic from "next/dynamic";


const CorilationPath = dynamic(() => import("./graph"), {
	ssr: false,
});


export default function FocusGraphWrapper(props: { }) {
	return(
		<div className="h-[100vh] w-full">
			<CorilationPath />
		</div>
	);
}