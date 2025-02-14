#include "Simplex.hpp"


Simplex::Simplex(int a)
	: m_alpha(a)
{
}

Simplex::Simplex(std::vector<int> nodes)
	: m_nodes(nodes)
	, m_alpha(nodes.size())
{
}

void Simplex::addNode(int n)
{
	if (m_nodes.size() + 1 >= m_alpha)
	{
		throw std::logic_error("Simplex overflow");
	}

	m_nodes.push_back(n);
}

bool Simplex::isSimplexValid() const
{
	return m_alpha == m_nodes.size();
}

std::vector<int> Simplex::getNodesList() const
{
	return m_nodes;
}

int Simplex::getAlpha() const
{
	return m_alpha;
}
