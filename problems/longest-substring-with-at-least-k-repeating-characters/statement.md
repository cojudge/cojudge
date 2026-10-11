For a lowercase string `s` and a threshold `k`, consider every contiguous block of `s`. A block counts as *good* when each distinct letter inside it occurs at least `k` times within that block (letters absent from the block are ignored). Return the length of the longest good block, or `0` when no good block exists.

Note that a good block need not use the whole string: rare letters can be skipped by cutting around them.

**Example 1:**
```
Input: s = "aaabb", k = 3
Output: 3
Explanation: "aaa" is good because 'a' appears 3 times. The full "aaabb"
fails since 'b' appears only twice.
```

**Example 2:**
```
Input: s = "ababbc", k = 2
Output: 5
Explanation: "ababb" is good ('a' twice, 'b' three times) and is the longest
such block.
```

**Example 3:**
```
Input: s = "abcde", k = 2
Output: 0
Explanation: Every letter appears once, so no block reaches the threshold.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` contains only lowercase English letters.
- `1 <= k <= 10^5`
