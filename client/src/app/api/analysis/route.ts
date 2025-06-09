import { IDocAnalysisInput } from '@/services/doc-analysis/IDocAnalysisInput';
import { TDocAnalysisOutput } from '@/services/doc-analysis/IDocAnalysisOutput';
import { PROCESS_TOP_WORDS } from '@/services/doc-analysis/IDocAnalysisProcessor';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const input: IDocAnalysisInput = await request.json();
  const output: TDocAnalysisOutput[] = [];
  if (input.analysis_type !== 'top_words') return NextResponse.json(output);

  const topWordsAllMacros: Record<string, string[]> = PROCESS_TOP_WORDS(
    input.text_body,
    input.keyword_macros
  );

  for (const macro of Object.keys(topWordsAllMacros)) {
    const result: TDocAnalysisOutput = {
      keyword_macro: macro,
      analysis_type: 'top_words',
      value: topWordsAllMacros[macro],
    };

    output.push(result);
  }

  return NextResponse.json(output);
};
