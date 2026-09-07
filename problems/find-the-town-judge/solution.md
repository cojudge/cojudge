## Approach

Maintain a score for each person: +1 when trusted, -1 when trusting. The judge ends with score `n-1`.

## Complexity Analysis

- **Time Complexity:** O(n + trust.length)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def findJudge(self, n: int, trust: List[List[int]]) -> int:
        score = [0] * (n + 1)
        for a, b in trust:
            score[a] -= 1
            score[b] += 1
        for i in range(1, n + 1):
            if score[i] == n - 1:
                return i
        return -1
```
