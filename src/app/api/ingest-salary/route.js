import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  try {
    const body = await request.json();
    const { baseSalary, stockGrant = 0, bonus = 0, yoeTotal, companyLevel, companyUuid, role, location } = body;
    
    // Strict Input Validation
    if (!baseSalary || !yoeTotal || !companyLevel || !companyUuid || !role || !location) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Logic: Calculate total comp backend-side
    const totalComp = baseSalary + stockGrant + bonus;

    // Normalizing company would typically involve getting the company record, 
    // but here we just attach the salary to the existing company via companyUuid.
    // Ensure company exists:
    const company = await prisma.company.findUnique({ where: { companyUuid } });
    if (!company) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
    }

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
        role,
        location,
        confidenceScore: 100 // default confidence
      }
    });

    return NextResponse.json({ success: true, record: newSalary });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
