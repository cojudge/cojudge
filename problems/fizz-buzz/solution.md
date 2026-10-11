## Approach

Walk i from 1 through n and pick the label by divisibility: the both-divisible case first, then the single-divisor cases, then the numeric fallback. Collecting labels in order directly yields the required list.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n) for the answer.

## Implementation

```python
from typing import List

class Solution:
    def fizzBuzz(self, n: int) -> List[str]:
        ans = []
        for i in range(1, n + 1):
            if i % 15 == 0:
                ans.append("FizzBuzz")
            elif i % 3 == 0:
                ans.append("Fizz")
            elif i % 5 == 0:
                ans.append("Buzz")
            else:
                ans.append(str(i))
        return ans
```
