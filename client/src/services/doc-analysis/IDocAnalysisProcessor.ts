const ALWAYS_EXCLUDED_WORDS: string[] = ['and', 'the', 'or', 'a', 'of', ''];

interface FiltersOutput {
  required: string[];
  excluded: string[];
}

export const PROCESS_TOP_WORDS = (
  text_body: string,
  keyword_macros: string[]
): Record<string, string[]> => {
  const sentences: string[] = text_body.toLowerCase().split('.');
  const output: Record<string, string[]> = {};

  keyword_macros.forEach((macro) => {
    macro = macro.toLowerCase();
    output[macro] = PROCESS_TOP_WORDS_GIVEN_MACRO(sentences, macro);
  });

  return output;
};

const PRODUCE_FILTERS = (
  sentences: string[],
  keyword_macro: string
): FiltersOutput => {
  const filters: string[] = ('+' + keyword_macro)
    .replaceAll('+', ',+')
    .replaceAll('-', ',-')
    .split(',');

  const required: string[] = filters
    .filter((word) => word.startsWith('+'))
    .map((word) => word.substring(1));

  const excluded: string[] = filters
    .filter((word) => word.startsWith('-'))
    .map((word) => word.substring(1));

  return { required: required, excluded: excluded };
};

const FILTER_SENTENCES = (
  required: string[],
  excluded: string[],
  sentences: string[]
): string[] => {
  required.forEach((requiredWord) => {
    sentences = sentences.filter((sentence) => sentence.includes(requiredWord));
  });

  excluded.forEach((excludedWord) => {
    sentences = sentences.filter(
      (sentence) => !sentence.includes(excludedWord)
    );
  });

  return sentences;
};

const SORT_WORDS_BY_COUNT = (
  required: string[],
  excluded: string[],
  sentences: string[]
): string[] => {
  const wordsToExclude: string[] = [
    ...ALWAYS_EXCLUDED_WORDS,
    ...required,
    ...excluded,
  ];

  const wordCounts: Record<string, number> = {};
  sentences.forEach((sentence) => {
    const words: string[] = sentence.replace(/[^a-z ]/gi, '').split(' ');

    words
      .filter((word) => !wordsToExclude.includes(word))
      .forEach((word) => {
        wordCounts[word] = 1 + (wordCounts[word] ?? 0);
      });
  });

  const wordsSortedByCount: string[] = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))
    .map((a) => a[0]);

  return wordsSortedByCount;
};

const PROCESS_TOP_WORDS_GIVEN_MACRO = (
  sentences: string[],
  keyword_macro: string
): string[] => {
  const { required, excluded } = PRODUCE_FILTERS(sentences, keyword_macro);

  const filteredSentences: string[] = FILTER_SENTENCES(
    required,
    excluded,
    sentences
  );

  const wordsSortedByCount: string[] = SORT_WORDS_BY_COUNT(
    required,
    excluded,
    filteredSentences
  );

  return [wordsSortedByCount[0], wordsSortedByCount[1], wordsSortedByCount[2]];
};
