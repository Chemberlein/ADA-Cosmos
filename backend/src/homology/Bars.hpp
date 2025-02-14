#pragma once

#include "data/Table.hpp"
#include "Complex.hpp"

class Bars
{
	public:
		Bars(Table t);
		Bars(Complex c);
	private:
		void compute();
		void computeComplex();
		Complex m_complex;
		std::vector<std::pair<int, int>> m_bars;
}
