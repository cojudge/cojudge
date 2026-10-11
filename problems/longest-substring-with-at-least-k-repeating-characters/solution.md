## Approach

A letter that appears fewer than `k` times in the current interval cannot be part of any good block spanning that interval, so the answer must lie in the pieces between such rare letters. Count frequencies, find the first rare letter, split there, and recurse on both sides. An interval with no rare letter is entirely good. Memo-free recursion over at most the alphabet depth keeps it simple.

## Complexity Analysis

- **Time Complexity:** O(n * alphabet) worst case, effectively O(n) for lowercase input.
- **Space Complexity:** O(n) recursion and counting in the worst case.

## Implementation

```python
class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        def helper(lo: int, hi: int) -> int:
            if hi - lo < k:
                return 0
            cnt = [0] * 26
            for i in range(lo, hi):
                cnt[ord(s[i]) - ord('a')] += 1
            for i in range(lo, hi):
                if cnt[ord(s[i]) - ord('a')] < k:
                    j = i + 1
                    while j < hi and cnt[ord(s[j]) - ord('a')] < k:
                        j += 1
                    return max(helper(lo, i), helper(j, hi))
            return hi - lo
        return helper(0, len(s))
```
