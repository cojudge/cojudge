## Approach

Greedily track counts of $5 and $10 bills. For a $10 give one $5. For a $20 prefer one $10 + one $5, else three $5s.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def lemonadeChange(self, bills: List[int]) -> bool:
        five = ten = 0
        for b in bills:
            if b == 5:
                five += 1
            elif b == 10:
                if five == 0:
                    return False
                five -= 1
                ten += 1
            else:
                if ten and five:
                    ten -= 1
                    five -= 1
                elif five >= 3:
                    five -= 3
                else:
                    return False
        return True
```
