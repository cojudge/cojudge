You are given a list `words` of pairwise different strings. Find every ordered index pair `(i, j)` with `i != j` such that gluing `words[i]` in front of `words[j]` produces a palindrome (a string reading identically forwards and backwards).

Return all such pairs. The order of pairs in the answer does not matter.

**Constraints:**
- `1 <= words.length <= 5000`
- `0 <= words[i].length <= 300`
- `words[i]` uses only lowercase English letters.
- All entries of `words` are distinct.

**Adaptation note:** The nested pair list is represented as `int_list_2d` in this judge; pair order is ignored during checking.
