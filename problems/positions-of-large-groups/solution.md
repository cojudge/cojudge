## Approach

Scan the string once while remembering where the current run of identical letters began. Whenever the next character differs (or the string ends), measure the run length and keep the [start, end] pair if it reaches 3. Because runs are found left to right, the collected pairs are already in the required order.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the string length.
- **Space Complexity:** O(1) besides the output list.

## Implementation

```python
from typing import List

class Solution:
    def largeGroupPositions(self, s: str) -> List[List[int]]:
        ans = []
        n = len(s)
        start = 0
        for i in range(n + 1):
            if i == n or s[i] != s[start]:
                if i - start >= 3:
                    ans.append([start, i - 1])
                start = i
        return ans
```
