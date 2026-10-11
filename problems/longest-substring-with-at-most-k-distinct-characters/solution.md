## Approach

Slide a window across the string while counting how many times each character appears inside it. Expanding the right end can only add distinct letters; whenever the distinct count passes `k`, move the left end forward (dropping counts) until the window fits again. Every maximal valid window is measured, and the largest measurement is the answer.

## Complexity Analysis

- **Time Complexity:** O(n), each character enters and leaves the window once.
- **Space Complexity:** O(min(n, alphabet)) for the frequency table.

## Implementation

```python
class Solution:
    def lengthOfLongestSubstringKDistinct(self, s: str, k: int) -> int:
        if k == 0 or not s:
            return 0
        from collections import defaultdict
        count = defaultdict(int)
        left = best = 0
        for right, c in enumerate(s):
            count[c] += 1
            while len(count) > k:
                lc = s[left]
                count[lc] -= 1
                if count[lc] == 0:
                    del count[lc]
                left += 1
            best = max(best, right - left + 1)
        return best
```
