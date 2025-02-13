#pragma once
#include "Graph.hpp"


class ForceDirectedLayout : public Graph
{
	public:
		ForceDirectedLayout(int nbOfNodes = 0, int nbOfEdges = 0);
		int addNode(int weight);
		int addEdge(int u, int v, float weight);
	private:
		std::vector<float> m_weight;
}
