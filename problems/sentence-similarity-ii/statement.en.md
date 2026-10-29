Two sentences are lists of words. They are similar when they hold the same number of words and every pair of words at matching positions can be linked, where linkage now chains through the given pairs:

- Every word links to itself.
- Each listed pair links its two words in both directions.
- Linkage is transitive: when `a` links to `b` and `b` links to `c`, then `a` links to `c`.

Given `sentence1`, `sentence2` and `similarPairs` (each entry holds two words), decide whether the sentences are similar under this chaining rule. Note that two words sharing a group match even if no direct pair names them together.

**Constraints:**
- `1 <= sentence1.length, sentence2.length <= 1000`
- `0 <= similarPairs.length <= 2000`
- Words hold lowercase letters.
