You are given an array `words` of lowercase strings. Consider pairs of words that share no letter in common (no character appearing in both). For each such pair, multiply their lengths; return the largest product found. When no disjoint pair exists, return `0`.

**Example 1:**
```
Input: words = ["abcw","baz","foo","bar","xtfn","abcdef"]
Output: 16
Explanation: "abcw" (length 4) and "xtfn" (length 4) use disjoint letters, giving 4 * 4 = 16, which is best possible.
```

**Example 2:**
```
Input: words = ["a","ab","abc","d","cd","bcd","abcd"]
Output: 4
Explanation: "ab" and "cd" share nothing and yield 2 * 2 = 4.
```

**Example 3:**
```
Input: words = ["a","aa","aaa","aaaa"]
Output: 0
Explanation: Every pair shares the letter 'a', so no valid pair exists.
```

**Constraints:**
- `2 <= words.length <= 1000`
- `1 <= words[i].length <= 1000`
- Each `words[i]` holds only lowercase English letters.
