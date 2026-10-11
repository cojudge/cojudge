A prefix tree, spoken like "try" and often called a trie, organizes a collection of strings so that entries sharing a beginning share structure. Typical uses include predictive text and spelling assistance.

Build a class named `Trie` supporting:

- `Trie()` Creates a fresh empty structure.
- `void insert(String word)` Adds the string `word` to the stored collection.
- `boolean search(String word)` Reports `true` when `word` was added earlier as a complete entry, and `false` otherwise.
- `boolean startsWith(String prefix)` Reports `true` when some previously added `word` begins with `prefix`, and `false` otherwise.

**Constraints:**

- `1 <= word.length, prefix.length <= 2000`
- Both `word` and `prefix` use only lowercase English letters.
- No more than `3 * 10^4` invocations of `insert`, `search`, and `startsWith` occur in total.
