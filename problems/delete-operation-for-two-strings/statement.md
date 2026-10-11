Two words can only be changed by deleting characters. Find the smallest number of single-character deletions that makes the two words identical.

In other words, keep a subsequence shared by both words and delete everything else; maximizing the kept part minimizes the deletions.

**Example 1:**
```
Input: word1 = "sea", word2 = "eat"
Output: 2
Explanation: Remove s from the first and t from the second to get ea in both.
```

**Example 2:**
```
Input: word1 = "a", word2 = "b"
Output: 2
Explanation: Nothing matches, so both characters must go.
```

**Example 3:**
```
Input: word1 = "abc", word2 = "abc"
Output: 0
```

**Constraints:**
- `1 <= word1.length, word2.length <= 500`
- Words contain lowercase English letters.
