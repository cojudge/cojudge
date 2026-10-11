Two sentences are lists of words. They are called similar when every pair of words at the same position can be matched, using these rules:

- The sentences must hold the same number of words.
- A word always matches itself.
- Otherwise, words `a` and `b` match when the pair `(a, b)` or `(b, a)` appears in the given similarity list. Matching is symmetric but it does not chain: `a` matching `b` and `b` matching `c` does not make `a` match `c`.

Given `sentence1`, `sentence2` and the list `similarPairs` (each entry holds two words), decide whether the sentences are similar.

**Constraints:**
- `1 <= sentence1.length, sentence2.length <= 1000`
- `0 <= similarPairs.length <= 2000`
- Words hold lowercase letters; each pair holds two words.
