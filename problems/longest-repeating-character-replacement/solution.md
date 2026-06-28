## Approach
Use a sliding window with a frequency map tracking character counts. Maintain the maximum frequency of any single character in the current window. The window is valid when `window_size - max_freq <= k`; if invalid, shrink from the left.

## Complexity Analysis
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation
```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}
        l = 0
        maxf = 0
        for r in range(len(s)):
            count[s[r]] = count.get(s[r], 0) + 1
            maxf = max(maxf, count[s[r]])
            if r - l + 1 - maxf > k:
                count[s[l]] -= 1
                l += 1
        return len(s) - l
```
