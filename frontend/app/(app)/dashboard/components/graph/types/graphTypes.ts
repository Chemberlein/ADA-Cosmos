// app/(app)/dashboard/components/graph/types/graphTypes.ts
import { SunMarketData, TokenData } from "../../data/getTokensData";
import * as THREE from "three";

export const MAX_NODE_SIZE = 1000;
export const ORBIT_GAP = 30;
export const OFFSET = 3;

// Loading states enum
export enum LoadingStates {
  INITIAL = "initial",
  BASIC = "basic",
  COMPLETE = "complete",
}

export interface TokenDataNode extends TokenData {
  id: string;
  val: number;
  x: number;
  y: number;
  z: number;
  fx: number;
  fy: number;
  fz: number;
  orbitRadius: number;
  angle: number;
}

export interface SunNode {
  id: "sun";
  marketData: SunMarketData;
  val: number;
  x: number;
  y: number;
  z: number;
  fx: number;
  fy: number;
  fz: number;
}

export interface WalletNode {
  id: string;
  type: "wallet";
  address: string;
  walletData: any;
  val: number;
  x: number;
  y: number;
  z: number;
  fx?: number;
  fy?: number;
  fz?: number;
  orbitRadius: number;
  angle: number;
  orbitSpeed: number;
}

export type GraphNode = TokenDataNode | SunNode | WalletNode;

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface SharedMaterials {
  hoverRing: THREE.Material;
  selectedRing: THREE.Material;
}

export interface GeometryCache {
  get(key: string): THREE.BufferGeometry | undefined;
  set(key: string, geometry: THREE.BufferGeometry): void;
  has(key: string): boolean;
  clear(): void;
  forEach(
    callback: (value: THREE.BufferGeometry, key: string) => void
  ): void;
}

export interface TokensGraphProps {
  tokens: TokenData[];
  sunMarketData: SunMarketData;
}
