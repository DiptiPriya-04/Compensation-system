import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  try {
    const { companyUuid } = params;

    const company = await prisma.company.findUnique({
      where: { companyUuid },
      include: {
        salaries: {
          orderBy: { totalComp: 'desc' }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Calculate median compensation
    const salaries = company.salaries.map(s => s.totalComp).sort((a, b) => a - b);
    let medianComp = 0;
    if (salaries.length > 0) {
      const mid = Math.floor(salaries.length / 2);
      medianComp = salaries.length % 2 !== 0 ? salaries[mid] : (salaries[mid - 1] + salaries[mid]) / 2;
    }

    // Level distribution
    const distribution = {};
    company.salaries.forEach(s => {
      distribution[s.companyLevel] = (distribution[s.companyLevel] || 0) + 1;
    });

    return NextResponse.json({
      company: company.name,
      salaries: company.salaries,
      medianComp,
      distribution
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
