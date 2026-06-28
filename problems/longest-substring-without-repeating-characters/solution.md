## Approach
Use a sliding window with a hashmap storing each character's last seen index. When a duplicate is found within the current window, move the left boundary past the previous occurrence. Track the maximum window size encountered.

## Complexity Analysis
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        l = 0
        res = 0
        for r, c in enumerate(s):
            if c in seen and seen[c] >= l:
                l = seen[c] + 1
            else:
                res = max(res, r - l + 1)
            seen[c] = r
        return res
```
