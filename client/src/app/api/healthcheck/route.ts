import { IHealthCheckSummary } from '@/services/infra/IHealthCheckSummary';
import { NextResponse } from 'next/server';

export const POST = async (): Promise<NextResponse> => {
  const textBodyData: IHealthCheckSummary = {
    message: 'pong',
  };

  return NextResponse.json(textBodyData);
};
