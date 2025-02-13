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
		int m_alpha;
		std::vector<int> m_nodes;
		std::vector<std::shared_ptr<Complex>> m_childs;
		std::vector<std::shared_ptr<Complex>> m_parents;
}
