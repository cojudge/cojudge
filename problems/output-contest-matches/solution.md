## Approach

Simulate the bracket with a string array initialised to team numbers. Each round replaces the first half with parenthesised pairs of symmetric entries, halving the live size until the champion bracket remains.

## Complexity Analysis

- **Time Complexity:** O(n log n) characters processed across rounds.
- **Space Complexity:** O(n log n) for the nested output strings.

## Implementation

```python
class Solution:
    def findContestMatch(self, n: int) -> str:
        cur = [str(i + 1) for i in range(n)]
        size = n
        while size > 1:
            for i in range(size // 2):
                cur[i] = f"({cur[i]},{cur[size - 1 - i]})"
            size //= 2
        return cur[0]
```
