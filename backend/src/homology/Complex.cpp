#include "Complex.hpp"


Complex::Complex(int a)
	: m_alpha(a)
{
}

Complex::Complex(std::vector<int> nodes)
	: m_nodes(nodes)
	, m_alpha(nodes.size())
{
}

void Complex::addNode(int n)
{
	if (m_nodes.size() + 1 >= m_alpha)
	{
		throw std::logic_error("Complex overflow");
	}

	m_nodes.push_back(n);
}

bool Complex::isComplexValid() const
{
	return m_alpha == m_nodes.size();
}

std::vector<int> Complex::getNodesList() const
{
	return m_nodes;
}

int Complex::getAlpha() const
{
	return m_alpha;
}
