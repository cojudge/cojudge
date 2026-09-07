## Approach

Track each value's frequency in a hash map and keep one stack per frequency
level. `maxFreq` records the current highest frequency. Pushing `v` increments
its frequency `f`, updates `maxFreq`, and pushes `v` onto group `f`. Popping
removes the top of group `maxFreq` (the most recent among the most frequent),
decrements its frequency, and lowers `maxFreq` when that group becomes empty.

## Complexity Analysis

- **Time Complexity:** `O(m)` over `m` operations, `O(1)` per `push`/`pop`.
- **Space Complexity:** `O(m)` for the frequency map and grouped stacks.

## Implementation

```python
from collections import defaultdict
from typing import List


class Solution:
    def runFreqStack(self, operations: List[str], values: List[int]) -> List[int]:
        freq: dict[int, int] = {}
        groups: dict[int, list[int]] = defaultdict(list)
        max_freq = 0
        answers: List[int] = []
        for operation, value in zip(operations, values):
            if operation == "push":
                f = freq.get(value, 0) + 1
                freq[value] = f
                max_freq = max(max_freq, f)
                groups[f].append(value)
            else:
                v = groups[max_freq].pop()
                freq[v] -= 1
                answers.append(v)
                if not groups[max_freq]:
                    max_freq -= 1
        return answers
```
