import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStandardizedLevel } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  try {
    const body = await request.json();
    const { baseSalary, stockGrant, bonus, yoeTotal, companyLevel, companyUuid } = body;
    
    // Logic: Calculate total comp backend-side to prevent tampering or client calculation errors
    const totalComp = baseSalary + stockGrant + bonus;

    // Save the new salary entry into the database
    const newSalary = await prisma.salaryRecord.create({
      data: {
        baseSalary,
        stockGrant,
        bonus,
        totalComp,
        yoeTotal,
        companyLevel,
        companyUuid,
      }
    });

    return NextResponse.json({ success: true, record: newSalary });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyUuid = searchParams.get('companyUuid');
    const levelName = searchParams.get('level');
    const role = searchParams.get('role');
    const location = searchParams.get('location');

    // Logic: Build dynamic filters based on provided query params
    const whereClause = {};
    if (companyUuid) whereClause.companyUuid = companyUuid;
    if (levelName) whereClause.companyLevel = levelName;
    if (role) whereClause.role = { contains: role, mode: 'insensitive' };
    if (location) whereClause.location = { contains: location, mode: 'insensitive' };

    const salaryEntries = await prisma.salaryRecord.findMany({
      where: whereClause,
      include: { company: true },
      orderBy: { totalComp: 'desc' } // Sorting by total compensation descending
    });

    return NextResponse.json({ salaryEntries });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
