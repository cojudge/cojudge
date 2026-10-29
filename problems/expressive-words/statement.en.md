You are given a stretched string `s` and a list of candidate `words`. A word is called stretchy when it can be expanded into `s` by lengthening some of its character groups.

Picture both strings as blocks of repeated letters: for example `heeellooo` becomes (h,1), (e,2), (l,2), (o,3). A word matches when it has exactly the same block letters in the same order, and for every block either the two lengths are equal, or the `s` block has length at least 3 and is at least as long as the word block.

Return how many entries of `words` are stretchy.

**Constraints:**
- `1 <= s.length <= 100`
- `1 <= words.length <= 100`
- `1 <= words[i].length <= 100`
- `s` and each word consist of lowercase English letters.
