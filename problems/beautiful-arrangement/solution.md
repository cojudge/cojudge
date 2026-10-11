## Approach

Fill the positions from 1 to `n` one at a time. At each slot, try every still-unused number that satisfies the divisibility condition with the slot index, then recurse to the next slot and undo the choice afterwards. Reaching past the last slot means a complete valid ordering was built, so a counter is increased. Checking the rule eagerly prunes hopeless branches early.

## Complexity Analysis

- **Time Complexity:** O(n!) in the worst case, heavily pruned by the divisibility test; fine for n up to 15.
- **Space Complexity:** O(n) for the recursion stack and the used-marker array.

## Implementation

```python
class Solution:
    def countArrangement(self, n: int) -> int:
        self.total = 0
        used = [False] * (n + 1)
        def backtrack(pos):
            if pos > n:
                self.total += 1
                return
            for v in range(1, n + 1):
                if not used[v] and (v % pos == 0 or pos % v == 0):
                    used[v] = True
                    backtrack(pos + 1)
                    used[v] = False
        backtrack(1)
        return self.total
```
