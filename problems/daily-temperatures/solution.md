## Approach

Keep indices of unresolved days in a stack whose temperatures are
non-increasing. When a warmer temperature appears, repeatedly pop colder days
and record the distance to the current day. Indices left in the stack have no
warmer future day and retain the initial value `0`.

## Complexity Analysis

- **Time Complexity:** `O(n)` because each index is pushed and popped at most once.
- **Space Complexity:** `O(n)`.

## Implementation

```python
from typing import List


class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        answer = [0] * len(temperatures)
        stack: List[int] = []
        for day, temperature in enumerate(temperatures):
            while stack and temperature > temperatures[stack[-1]]:
                previous = stack.pop()
                answer[previous] = day - previous
            stack.append(day)
        return answer
```
