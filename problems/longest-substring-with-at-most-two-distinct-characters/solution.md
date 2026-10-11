## Approach

Slide a window across the string while counting how many times each character appears inside it. Expand the right edge one step at a time; whenever a third distinct character enters, advance the left edge until only two remain. The largest window size observed is the longest piece with at most two distinct characters.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each character enters and leaves the window once.
- **Space Complexity:** O(1), since the window holds at most three distinct characters.

## Implementation

```python
class Solution:
    def lengthOfLongestSubstringTwoDistinct(self, s: str) -> int:
        from collections import defaultdict
        count = defaultdict(int)
        left = 0
        best = 0
        for right, c in enumerate(s):
            count[c] += 1
            while len(count) > 2:
                lc = s[left]
                count[lc] -= 1
                if count[lc] == 0:
                    del count[lc]
                left += 1
            best = max(best, right - left + 1)
        return best
```
