## Approach

Begin with the identity ordering `1..n+1`, the smallest possible arrangement. Rising slots already match, so only falling runs need work: locate each maximal block of consecutive `D`s and reverse the corresponding slice (one element longer than the block). Reversing turns that slice into a descent using the smallest numbers that can do so, preserving minimality elsewhere.

## Complexity Analysis

- **Time Complexity:** O(n) — each position is scanned once and reversed at most once.
- **Space Complexity:** O(n) for the answer.

## Implementation

```python
from typing import List

class Solution:
    def findPermutation(self, s: str) -> List[int]:
        n = len(s)
        ans = list(range(1, n + 2))
        i = 0
        while i < n:
            if s[i] == "D":
                j = i
                while j < n and s[j] == "D":
                    j += 1
                ans[i:j + 1] = ans[i:j + 1][::-1]
                i = j
            else:
                i += 1
        return ans
```
