## Approach

Sort everyone tallest first, with smaller k first among equal heights. Then walk that order and insert each person at index k of the current line. Because all previously placed people are at least as tall, index k is precisely where that person's taller-or-equal count matches, and later shorter arrivals never disturb earlier counts.

## Complexity Analysis

- **Time Complexity:** O(n^2) due to sorting plus list insertions.
- **Space Complexity:** O(n) for the growing line.

## Implementation

```python
from typing import List

class Solution:
    def reconstructQueue(self, people: List[List[int]]) -> List[List[int]]:
        people = sorted(people, key=lambda x: (-x[0], x[1]))
        line: List[List[int]] = []
        for p in people:
            line.insert(p[1], p)
        return line
```
