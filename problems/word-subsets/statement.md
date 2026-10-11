You are given two string arrays `words1` and `words2`. A word from `words1` is called universal when, for every word `b` in `words2`, each letter appears in it at least as many times as it appears in `b`.

Return the list of all universal words from `words1`. The order of the returned list does not matter.

**Example 1:**
```
Input: words1 = ["amazon","apple","facebook","google","leetcode"], words2 = ["e","o"]
Output: ["facebook","google","leetcode"]
```

**Example 2:**
```
Input: words1 = ["amazon","apple","facebook","google","leetcode"], words2 = ["lo","eo"]
Output: ["google","leetcode"]
```

**Example 3:**
```
Input: words1 = ["amazon","apple","facebook","google","leetcode"], words2 = ["ec","oc","ceo"]
Output: ["facebook","leetcode"]
```

**Constraints:**
- `1 <= words1.length, words2.length <= 10^4`
- `1 <= words1[i].length, words2[i].length <= 30`
- All words consist of lowercase English letters
