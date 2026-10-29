You are given a long host string `s` and a list of candidate words `words`.
A candidate counts when it appears as a subsequence of `s`: its characters
must occur in `s` in the same relative order, though not necessarily next
to each other, with some characters of `s` possibly skipped. Repeated words
count repeatedly.

Return how many entries of `words` satisfy that property.

**Constraints:**
- `1 <= s.length <= 5 * 10^4`
- `1 <= words.length <= 5000`
- `1 <= words[i].length <= 50`
- `s` and each word hold only lower-case English letters.
