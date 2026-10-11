You receive a dictionary `words` holding distinct lowercase strings, all sharing one length. A word square is a sequence of that same length where row `k` and column `k` spell the same word for every `k`. In other words, if the sequence is `r0, r1, ..., r_{n-1}`, then the `j`-th letter of `ri` must equal the `j`-th letter of `rj` pattern: the prefix formed by the first `t` rows constrains which word may sit in row `t`.

List every word square you can assemble from `words`. Words may be reused. The order of the returned squares does not matter.

**Constraints:**
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 5`
- All words share the same length and are pairwise distinct.
- All words use lowercase English letters.

Adaptation: the source returns a nested list of strings; here it maps to `string_list_2d`.
