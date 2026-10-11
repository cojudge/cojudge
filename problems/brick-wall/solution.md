## Approach

For each row accumulate inner edge positions and count how many rows share each offset. Cutting at the most popular offset skips the most bricks, so the answer is rows minus that maximum frequency (zero frequency when no inner edge exists).

## Complexity Analysis

- **Time Complexity:** O(total bricks)
- **Space Complexity:** O(total edges) for the frequency map.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def leastBricks(self, wall: List[List[int]]) -> int:
        freq = Counter()
        for row in wall:
            s = 0
            for w in row[:-1]:
                s += w
                freq[s] += 1
        return len(wall) - max(freq.values(), default=0)
```
