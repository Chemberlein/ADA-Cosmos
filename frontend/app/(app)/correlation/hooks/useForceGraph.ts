import { useEffect, RefObject } from 'react';
import { GRAPH_CONSTANTS } from '../constants';
import { GraphData } from '../types';

export const useForceGraph = (
  ref: RefObject<any>,
  data: GraphData
) => {
  useEffect(() => {
    if (!ref.current) return;

    const { FORCE } = GRAPH_CONSTANTS;
    
    ref.current.d3Force("link")
      .strength((link: { averageCorrelation: any; }) => 
        link.averageCorrelation > 0 ? link.averageCorrelation : 0)
      .distance(() => FORCE.LINK_DISTANCE);
    
    ref.current.d3Force("charge").strength(FORCE.CHARGE_STRENGTH);
    ref.current.d3Force("center").strength(FORCE.CENTER_STRENGTH);
  }, [data, ref]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (ref.current) {
        ref.current.zoomToFit(GRAPH_CONSTANTS.ANIMATION.ZOOM_DURATION);
      }
    }, GRAPH_CONSTANTS.ANIMATION.INITIAL_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [ref]);
};
