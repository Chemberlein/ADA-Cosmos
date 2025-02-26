import { GraphLink } from '../types/graph';
import { GRAPH_CONSTANTS } from '../constants/graph';

export const removeDuplicateLinks = (links: GraphLink[]): GraphLink[] => {
  const uniqueLinks = new Map();
  
  links.forEach(link => {
    const nodeIds = [link.source, link.target].sort();
    const key = `${nodeIds[0]}-${nodeIds[1]}`;
    
    if (!uniqueLinks.has(key) || 
        Math.abs(link.avarageCorilation!) > Math.abs(uniqueLinks.get(key).avarageCorilation)) {
      uniqueLinks.set(key, link);
    }
  });

  return Array.from(uniqueLinks.values());
};

export const getNodeColor = (price: number): string => {
  if (price === 0) return 'rgba(128, 128, 128, 0.8)';
  
  const logScale = (value: number) => {
    const normalized = (Math.log(Math.abs(value)) - GRAPH_CONSTANTS.LOG_SCALE.MIN) / 
                      (GRAPH_CONSTANTS.LOG_SCALE.MAX - GRAPH_CONSTANTS.LOG_SCALE.MIN);
    return Math.min(Math.max(normalized, 0), 1);
  };

  const intensity = logScale(Math.abs(price));
  return price > 0
    ? `rgba(0, ${Math.floor(200 * intensity + 55)}, ${Math.floor(100 * (1 - intensity))}, 0.8)`
    : `rgba(${Math.floor(200 * intensity + 55)}, 0, ${Math.floor(100 * (1 - intensity))}, 0.8)`;
};
