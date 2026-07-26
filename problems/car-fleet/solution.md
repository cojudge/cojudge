## Approach

Process cars from the position closest to the target to the farthest. Track the
arrival time of the slowest fleet ahead; a car creates a new fleet only when
its arrival time is greater. Compare arrival-time fractions by cross
multiplication to avoid floating-point precision issues.

## Complexity Analysis

- **Time Complexity:** `O(n log n)` for sorting the cars by position.
- **Space Complexity:** `O(n)` for the sorted indices.

## Implementation

```python
from typing import List


class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        order = sorted(range(len(position)), key=position.__getitem__, reverse=True)
        fleets = 0
        fleet_distance = 0
        fleet_speed = 1
        for index in order:
            distance = target - position[index]
            if fleets == 0 or distance * fleet_speed > fleet_distance * speed[index]:
                fleets += 1
                fleet_distance = distance
                fleet_speed = speed[index]
        return fleets
```
