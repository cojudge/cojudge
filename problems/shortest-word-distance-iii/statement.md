Given an array of words `wordsDict` and two words `word1` and `word2` that each appear at least once, find the smallest distance between their positions.

This variant allows `word1` and `word2` to be the same word. When they are equal, the answer is the smallest gap between two different occurrences of that word. When they differ, the answer is the smallest gap between any occurrence of one and any occurrence of the other, exactly as in the basic version.

Return that minimum distance.

**Example 1:**
```
Input: wordsDict = ["practice","makes","perfect","coding","makes"], word1 = "makes", word2 = "coding"
Output: 1
Explanation: "makes" at index 4 neighbors "coding" at index 3.
```

**Example 2:**
```
Input: wordsDict = ["practice","makes","perfect","coding","makes"], word1 = "makes", word2 = "makes"
Output: 3
Explanation: "makes" occurs at indices 1 and 4, which are 3 apart.
```

**Constraints:**
- `1 <= wordsDict.length <= 300`
- `1 <= wordsDict[i].length <= 100`
- Each word holds lowercase English letters.
- `word1` and `word2` both occur in `wordsDict`.
