You are given a fixed word list `wordsDict`. Afterwards many queries arrive, each asking for the shortest distance between two words in that list.

The `i`-th query pairs `word1s[i]` with `word2s[i]`, and its answer is the minimum `|j - k|` over all positions `j` holding the first word and positions `k` holding the second word. Every queried word occurs at least once, and the two words in a query differ.

Return one answer per query, in order.

*Adaptation note:* the original statement defines a `WordDistance` class whose constructor stores the list and whose `shortest` method answers one query at a time. Following the function-adaptation pattern (as with the data-structure design problems), this version batches the work: the constructor input becomes `wordsDict` and the sequence of `shortest` calls becomes two parallel arrays `word1s` and `word2s`, with the results returned as an integer array.

**Example 1:**
```
Input: wordsDict = ["practice","makes","perfect","coding","makes"], word1s = ["coding","makes"], word2s = ["practice","coding"]
Output: [3,1]
Explanation: "coding" vs "practice" are 3 apart; "makes" vs "coding" are adjacent.
```

**Example 2:**
```
Input: wordsDict = ["a","b","c","a"], word1s = ["a"], word2s = ["c"]
Output: [1]
Explanation: The closest "a" to "c" is one position away.
```

**Constraints:**
- `1 <= wordsDict.length <= 3 * 10^4`
- `1 <= wordsDict[i].length <= 10`
- Each word holds lowercase English letters.
- `1 <= word1s.length == word2s.length <= 5000`
- Each queried word occurs in `wordsDict`; the pair in a query differs.
