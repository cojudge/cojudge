Stitch every word into one short string that holds each of them as a contiguous block.

Given distinct words, arrange them in some order and glue neighbours together with the largest possible overlap (the tail of one matching the head of the next). The result must contain every word somewhere inside it. Among all shortest results, any one is accepted. Assume no word appears inside another word.

**Example 1:**
```
Input: words = ["alex","loves","leetcode"]
Output: "alexlovesleetcode"
Explanation: The three words share no overlaps, so plain concatenation (in any order) is optimal.
```

**Example 2:**
```
Input: words = ["catg","ctaagt","gcta","ttca","atgcatc"]
Output: "gctaagttcatgcatc"
Explanation: Chaining through the best overlaps packs all five words into 16 characters; other chains of length 16 also count.
```

**Constraints:**
- `1 <= words.length <= 12`
- `1 <= words[i].length <= 20`
- Words hold lowercase English letters and are pairwise different.
- No word is a substring of another word.
