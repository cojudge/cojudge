Given an array of words `wordsDict` and two words `word1` and `word2` that each appear at least once, find the smallest distance between their positions.

This variant allows `word1` and `word2` to be the same word. When they are equal, the answer is the smallest gap between two different occurrences of that word. When they differ, the answer is the smallest gap between any occurrence of one and any occurrence of the other, exactly as in the basic version.

Return that minimum distance.

**Constraints:**
- `1 <= wordsDict.length <= 300`
- `1 <= wordsDict[i].length <= 100`
- Each word holds lowercase English letters.
- `word1` and `word2` both occur in `wordsDict`.
