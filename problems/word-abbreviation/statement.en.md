You are given a list of distinct lowercase words. For each word, build its *abbreviation* as follows: keep a prefix of the word, then write the count of skipped middle characters, then keep the last character. For example, with a one-letter prefix, `word` becomes `w2d` (keep `w`, skip 2 letters, keep `d`).

Two rules apply:
- If the abbreviation is not strictly shorter than the original word, keep the original word instead.
- Abbreviations in the final answer must be pairwise unique, so no two words may share one. Resolve clashes with the *shared-prefix growth rule*: while any abbreviation is used by more than one word, extend the kept prefix by one character for every word in each clashing group and rebuild those abbreviations (keeping the original whenever it is not shorter).

Return the abbreviations in the same order as the input words.

**Constraints:**
- `1 <= words.length <= 400`
- `1 <= words[i].length <= 400`
- All words are distinct and contain only lowercase English letters.
