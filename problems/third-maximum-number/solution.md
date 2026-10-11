## Approach

Walk the array once while keeping the three largest distinct values seen so far. Duplicates are skipped, and each new value cascades down the top-three slots when it beats them. After the scan, the third slot holds the answer, or the first slot does when fewer than three distinct values appeared.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def thirdMax(self, nums: List[int]) -> int:
        m1 = m2 = m3 = None
        for x in nums:
            if x == m1 or x == m2 or x == m3:
                continue
            if m1 is None or x > m1:
                m3, m2, m1 = m2, m1, x
            elif m2 is None or x > m2:
                m3, m2 = m2, x
            elif m3 is None or x > m3:
                m3 = x
        return m1 if m3 is None else m3
```
