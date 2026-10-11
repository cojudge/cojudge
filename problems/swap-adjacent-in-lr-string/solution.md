## Approach

Drop every `X` from both rows and require the remaining token sequences to
agree. Tokens keep their relative order because an `L` only drifts left
through empty cells and an `R` only drifts right, so they can never overtake
each other. While scanning past the empty cells, also enforce the direction
rule: an `L` in the start must begin at or to the right of its target slot,
and an `R` must begin at or to the left of its target slot.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the row length. Each pointer advances once.
- **Space Complexity:** O(1) besides the inputs.

## Implementation

```python
class Solution:
    def canTransform(self, start: str, end: str) -> bool:
        n = len(start)
        if len(end) != n:
            return False
        i = j = 0
        while i < n and j < n:
            while i < n and start[i] == 'X':
                i += 1
            while j < n and end[j] == 'X':
                j += 1
            if i == n and j == n:
                return True
            if i == n or j == n:
                return False
            if start[i] != end[j]:
                return False
            if start[i] == 'L' and i < j:
                return False
            if start[i] == 'R' and i > j:
                return False
            i += 1
            j += 1
        while i < n:
            if start[i] != 'X':
                return False
            i += 1
        while j < n:
            if end[j] != 'X':
                return False
            j += 1
        return True
```
