## Approach

Track both the total fuel balance and the balance from the current candidate start. If the candidate balance becomes negative at station `i`, no station from the current candidate through `i` can be a valid start, so reset the candidate to `i + 1`. A negative total means no circuit exists; otherwise, the final candidate completes the circuit.

## Complexity Analysis

- **Time Complexity:** O(n), with one pass over the stations.
- **Space Complexity:** O(1) auxiliary space.

## Implementation

```python
from typing import List


class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        total = 0
        tank = 0
        start = 0
        for index, (available, required) in enumerate(zip(gas, cost)):
            difference = available - required
            total += difference
            tank += difference
            if tank < 0:
                start = index + 1
                tank = 0
        return -1 if total < 0 else start % len(gas)
```
