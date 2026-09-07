## Approach

Sort `people`, then use two pointers: `i` at the lightest and `j` at the heaviest. If the lightest and heaviest fit together (`people[i] + people[j] <= limit`), pair them and move both pointers; otherwise the heaviest goes alone and only `j` moves. Each step uses one boat.

## Complexity Analysis

- **Time Complexity:** O(n log n) due to sorting, where n is the number of people. The two-pointer sweep is O(n).
- **Space Complexity:** O(1) extra besides sorting (O(n) if sorting needs auxiliary space).

## Implementation

```python
from typing import List
class Solution:
    def numRescueBoats(self, people: List[int], limit: int) -> int:
        people.sort()
        i, j = 0, len(people) - 1
        boats = 0
        while i <= j:
            if people[i] + people[j] <= limit:
                i += 1
            j -= 1
            boats += 1
        return boats
```
