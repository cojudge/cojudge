Given an array of words `wordsDict` and two different words `word1` and `word2` that each appear at least once in the array, find the smallest distance between their positions.

The distance between index `i` and index `j` is `|i - j|`. Consider every occurrence of both words and keep the minimum over all pairs.

Return that minimum distance.

**Example 1:**
```
Input: wordsDict = ["practice","makes","perfect","coding","makes"], word1 = "coding", word2 = "practice"
Output: 3
Explanation: "coding" is at index 3 and "practice" at index 0, so the gap is 3.
```

**Example 2:**
```
Input: wordsDict = ["practice","makes","perfect","coding","makes"], word1 = "makes", word2 = "coding"
Output: 1
Explanation: "makes" at index 4 and "coding" at index 3 are adjacent.
```

**Constraints:**
- `1 <= wordsDict.length <= 300`
- `1 <= wordsDict[i].length <= 100`
- Each word holds lowercase English letters.
- `word1` and `word2` both occur in `wordsDict` and are different.
