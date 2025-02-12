#pragma once
#include <vector>
#include <unordered_map>
#include <pair>

class Graph
{
	public:
		Graph(int nbOfNodes = 0, int nbOfEdges = 0);
		int addNode();
		void removeNode(int n);
		int addEdge(int u, int v);
		void removeEdge(int u, int v);
		void removeEdge(int e);
		int getEdgeID(int u, int v) const;
		std::pair<int, int> getEndPoints(int e) const;
		std::vector<int> getAdjacentEdges(int n) const;
		int getNbOfNodes() const;
		int getNbOfEdges() const;
	private:
		int m_nbOfNodes;
		int m_nbOfEdges;
		std::vector<std::vector<int>> m_edges;
		std::vector<int> m_recycledNodes;
		std::vector<int> m_recycledEdges;
}
