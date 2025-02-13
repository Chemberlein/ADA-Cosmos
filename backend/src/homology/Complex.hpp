#pragma once

class Complex
{
	public:
		Complex(int a);
		Complex(std::vector<int> nodes);
		
		void addNode(int n);
		bool isComplexValid() const;
		std::vector<int> getNodesList() const;
		int getAlpha() const;
	private:
		std::vector<int> m_nodes;
		int m_alpha;
}
