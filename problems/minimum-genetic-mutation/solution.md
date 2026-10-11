## Approach

Treat each bank gene plus the start as a node, linking nodes that differ in exactly one position. Breadth-first search from the start expands in increasing mutation count, so the first visit to the target is optimal. Missing targets or exhausted queues mean `-1`.

## Complexity Analysis

- **Time Complexity:** O(b^2 * L), where b is the bank size and L is 8. Each dequeued gene is compared against the bank.
- **Space Complexity:** O(b) for the queue and visited set.

## Implementation

```python
from collections import deque
class Solution:
    def minMutation(self, startGene: str, endGene: str, bank) -> int:
        bank_set = set(bank)
        if endGene not in bank_set:
            return -1
        def one(a, b):
            return sum(1 for x, y in zip(a, b) if x != y) == 1
        q = deque([startGene])
        seen = {startGene}
        steps = 0
        while q:
            for _ in range(len(q)):
                cur = q.popleft()
                if cur == endGene:
                    return steps
                for nb in bank:
                    if nb not in seen and one(cur, nb):
                        seen.add(nb)
                        q.append(nb)
            steps += 1
        return -1
```
