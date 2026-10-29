You receive a text string `s` together with a list `words` in which every word has the same length. A *concatenated block* is formed by gluing together every word from the list exactly once, in any order, with no gaps or extra characters.

Find every starting index `i` such that the slice of `s` beginning at `i` is a concatenated block, and return those indices in any order.

**Constraints:**
- `1 <= s.length <= 10^4`
- `1 <= words.length <= 5000`
- `1 <= words[i].length <= 30`
- `s` and each word consist of lowercase English letters, and all words share one length.
