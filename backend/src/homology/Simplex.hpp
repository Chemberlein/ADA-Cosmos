#pragma once

class Simplex
{
	public:
		Simplex(int a);
		Simplex(std::vector<int> nodes);
		
		void addNode(int n);
		bool isSimplexValid() const;
		std::vector<int> getNodesList() const;
		int getAlpha() const;
	private:
		float m_start, m_end; // TODO Adapt structure to use this values
		int m_alpha;
		std::vector<int> m_nodes;
		std::vector<std::shared_ptr<Simplex>> m_childs;
		std::vector<std::shared_ptr<Simplex>> m_parents;
}
