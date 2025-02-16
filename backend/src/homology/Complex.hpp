#pragma once

class Complex
{
	public:
		Complex();
		void addSimplex();
		std::vector<std::vector<std::shared_ptr<Bars>>> generateBars();
	private:
		std::vector<std::vector<std::shared_ptr<Complex>>> m_complex;
}
