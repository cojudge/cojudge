Given an array of words `wordsDict` and two different words `word1` and `word2` that each appear at least once in the array, find the smallest distance between their positions.

The distance between index `i` and index `j` is `|i - j|`. Consider every occurrence of both words and keep the minimum over all pairs.

Return that minimum distance.

**Constraints:**
- `1 <= wordsDict.length <= 300`
- `1 <= wordsDict[i].length <= 100`
- Each word holds lowercase English letters.
- `word1` and `word2` both occur in `wordsDict` and are different.
