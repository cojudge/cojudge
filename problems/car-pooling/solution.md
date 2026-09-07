## Approach

Use a difference array over the 1001 possible kilometer positions (the maximum `to` position is 1000). For every trip add its passengers at `from` and subtract them at `to`. Then sweep mile by mile, accumulating the running passenger count; if it ever exceeds `capacity`, return `false`. Because drops and pickups at the same location resolve to drop-off first, subtracting at `to` before later pickups at the same index is automatically correct in the sweep.

## Complexity Analysis

- **Time Complexity:** O(n + L), where `n` is `trips.length` and `L = 1001` is the fixed number of locations.
- **Space Complexity:** O(1), since the difference array has a fixed size of 1001.

## Implementation

```python
from typing import List

class Solution:
    def carPooling(self, trips: List[List[int]], capacity: int) -> bool:
        delta = [0] * 1001
        for passengers, start, end in trips:
            delta[start] += passengers
            delta[end] -= passengers
        onboard = 0
        for change in delta:
            onboard += change
            if onboard > capacity:
                return False
        return True
```