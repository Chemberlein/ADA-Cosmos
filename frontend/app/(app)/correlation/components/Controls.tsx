import { Maximize2, Settings, Info } from "lucide-react";
import { useState } from "react";
import InfoModal from "./InfoModal"; // Changed to default import

interface ControlsProps {
  correlationThreshold: number;
  minMeasurements: number;
  onCorrelationChange: (value: number) => void;
  onMeasurementsChange: (value: number) => void;
  onZoomToFit: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  correlationThreshold,
  minMeasurements,
  onCorrelationChange,
  onMeasurementsChange,
  onZoomToFit,
}) => {
  const [showSliders, setShowSliders] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-4">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowInfo(true)}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
            title="Information"
          >
            <Info size={24} />
          </button>
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
            title="Settings"
          >
            <Settings size={24} />
          </button>
          <button
            onClick={onZoomToFit}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
            title="Fit View"
          >
            <Maximize2 size={24} />
          </button>
        </div>

        {showSliders && (
          <div className="bg-black p-4 rounded-lg text-white">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="correlation">
                  Correlation Threshold: {correlationThreshold.toFixed(2)}
                </label>
                <input
                  type="range"
                  id="correlation"
                  min="0"
                  max="1"
                  step="0.01"
                  value={correlationThreshold}
                  onChange={(e) => onCorrelationChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="measurements">
                  Minimum Measurements: {minMeasurements}
                </label>
                <input
                  type="range"
                  id="measurements"
                  min="1"
                  max="500"
                  step="1"
                  value={minMeasurements}
                  onChange={(e) => onMeasurementsChange(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
};
