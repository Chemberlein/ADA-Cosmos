#include "graphs.hpp"

Graph::Graph(int nbOfNodes, int nbOfEdges)
	: m_nbOfNodes(nbOfNodes)
	, m_nbOfEdges(nbOfEdges)
{
	m_edges = std::vector<std::vector<int>>(nbOfNodes, std::vector<int>(nbOfNodes, -1));

}

int Graph::addNode()
{
	int resualt;
	if (m_recycledNodes.empty())
	{
		for (auto i : m_edges)
		{
			i.push_back(-1);
		}
		m_nbOfNodes++;
		m_edges.push_back(std::vector<int>(m_nbOfNodes, -1));

		resualt = m_nbOfNodes-1;
	}
	else
	{
		resualt = m_recycledNodes.back();
		m_recycledNodes.pop_back();
		m_nbOfNodes++;
	}

	return resualt;
}

void Graph::removeNode(int n)
{
	for (int i = 0; i < m_edges.size(); i++)
	{
		m_edges[i][n] = -1;
		m_edges[n][i] = -1;
	}
	m_recycledNodes.push_back(n);
	m_nbOfNodes--;
}

int Graph::addEdge(int u, int v)
{
	if (u<0 || v<0 || u>=m_edges.size() || v>=m_edges.size())
	{
		throw std::logic_error("Graph:V:addEdge : invalid id of the indeces");
	}

	int edgeID;
	if (m_recycledEdges.empty())
	{
		edgeID = m_nbOfEdges;
	}
	else
	{
		edgeID = m_recycledEdges.back();
		m_recycledEdges.pop_back();
	}

	m_edges[u][v] = edgeID;
	m_edges[v][u] = edgeID;

	m_nbOfEdges++;

	return edgeID;
}

void Graph::removeEdge(int u, int v)
{
	int edgeID = m_edges[u][v];
	m_edges[u][v] = -1;
	m_edges[v][u] = -1;

	m_recycledEdges.push_back(edgeID);
	m_nbOfEdges--;
}

void Graph::removeEdge(int e)
{
	auto [u, v] = getEndPoints(e);
	removeEdge(u, v);
}

int Graph::getEdgeID(int u, int v) const
{
	return m_edges[u][v];
}

std::pair<int, int> Graph::getEndPoints(int e) const
{
	if (e < 0 || e >= m_nbOfEdges || m_recycledEdges.contains(e))
	{
		throw std::logic_error("Graph::getEndPoints : invalid id of the edge");
	}

	for(auto i = 0; i < m_edges.size(); i++)
	{
		for(auto j = 0; j < m_edges.size(); j++)
		{
			if (m_edges[i][j] == e)
			{
				return std::make_pair<int, int>(i, j);
			}
		}
	}

	return std::make_pair<int, int>(-1, -1);
}

std::vector<int> Graph::getAdjacentEdges(int n) const
{
	std::vector<int> resualt;

	for (auto i = 0; i < m_edges.size(); i++)
	{
		if (m_edges[n][i] != -1)
		{
			resualt.push_back(m_edges[n][i]);
		}
	}

	return resualt;
}

int Graph::getNbOfNodes() const
{
	return m_nbOfNodes;
}

int Graph::getNbOfEdges() const
{
	return m_nbOfEdges;
}
