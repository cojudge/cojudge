## Approach

Tally the occurrences of each distinct card. A common group size `X` works exactly when it divides every tally, so the best candidate is the greatest common divisor of all tallies. The deck splits evenly precisely when that divisor is at least 2.

## Complexity Analysis

- **Time Complexity:** O(n + m log m) for counting plus gcd steps over the tallies.
- **Space Complexity:** O(m) for the frequency table of m distinct values.

## Implementation

```python
from typing import List
from collections import Counter
import math
class Solution:
    def hasGroupsSizeX(self, deck: List[int]) -> bool:
        counts = Counter(deck).values()
        g = 0
        for c in counts:
            g = math.gcd(g, c)
        return g >= 2
```
