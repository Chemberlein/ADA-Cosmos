import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg text-white relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">About Graph Visualization</h2>
        <div className="space-y-3">
          <p>This graph shows correlations between different assets.</p>
          <p>• Node size represents liquidity</p>
          <p>• Node color indicates price changes</p>
          <p>• Link thickness shows correlation strength</p>
          <p>• Link color indicates positive (white) or negative (red) correlation</p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
