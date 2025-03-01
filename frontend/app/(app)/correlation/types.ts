// app/(app)/correlation/types.ts
export interface GraphNode {
	id: string;
	name: string;
	price?: number;
	liquidity?: number;
	x?: number;
	y?: number;
	z?: number;
	ticker?: string;
}

export interface GraphLink {
	source: string;
	target: string;
	avarageCorilation: number | null;
	nbOfMesurments: number;
	averageCorrelation?: number;
}

export interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
}

export interface ControlsProps {
	correlationThreshold: number;
	minMeasurements: number;
	onCorrelationChange: (value: number) => void;
	onMeasurementsChange: (value: number) => void;
	onZoomToFit: () => void;
}

export interface InfoModalProps {
	isOpen: boolean;
	onClose: () => void;
}
