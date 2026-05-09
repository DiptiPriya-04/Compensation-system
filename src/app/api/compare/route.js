import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id1 = searchParams.get('salary1');
    const id2 = searchParams.get('salary2');

    if (!id1 || !id2) {
      return NextResponse.json({ error: "Please provide both salary1 and salary2 UUIDs" }, { status: 400 });
    }

    const salary1 = await prisma.salaryRecord.findUnique({
      where: { salaryUuid: id1 },
      include: { company: true }
    });
    
    const salary2 = await prisma.salaryRecord.findUnique({
      where: { salaryUuid: id2 },
      include: { company: true }
    });

    if (!salary1 || !salary2) {
      return NextResponse.json({ error: "One or both salaries not found" }, { status: 404 });
    }

    // Attempt to get level mappings to find level difference
    const map1 = await prisma.levelMapping.findFirst({
      where: { companyUuid: salary1.companyUuid, companyLevel: salary1.companyLevel }
    });
    
    const map2 = await prisma.levelMapping.findFirst({
      where: { companyUuid: salary2.companyUuid, companyLevel: salary2.companyLevel }
    });

    let levelDifference = null;
    if (map1 && map2) {
      levelDifference = Math.abs(map1.standardRank - map2.standardRank);
    }

    const comparison = {
      salary1: {
        id: salary1.salaryUuid,
        company: salary1.company.name,
        role: salary1.role,
        level: salary1.companyLevel,
        base: salary1.baseSalary,
        bonus: salary1.bonus,
        stock: salary1.stockGrant,
        total: salary1.totalComp
      },
      salary2: {
        id: salary2.salaryUuid,
        company: salary2.company.name,
        role: salary2.role,
        level: salary2.companyLevel,
        base: salary2.baseSalary,
        bonus: salary2.bonus,
        stock: salary2.stockGrant,
        total: salary2.totalComp
      },
      differences: {
        base: Math.abs(salary1.baseSalary - salary2.baseSalary),
        bonus: Math.abs(salary1.bonus - salary2.bonus),
        stock: Math.abs(salary1.stockGrant - salary2.stockGrant),
        total: Math.abs(salary1.totalComp - salary2.totalComp),
        levelDifference
      }
    };

    return NextResponse.json(comparison);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
