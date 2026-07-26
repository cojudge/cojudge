## Approach

Count how many of each lowercase letter `s1` requires, then scan `s2` with a fixed-size sliding window. When a character enters or leaves the window, update its deficit and the number of required characters still missing. A window is a permutation exactly when its length is `s1.length` and no required characters remain.

## Complexity Analysis

- **Time Complexity:** O(m + n), where `m` is the length of `s1` and `n` is the length of `s2`.
- **Space Complexity:** O(1), because the frequency array always has 26 entries.

## Implementation

```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False

        needed = [0] * 26
        for char in s1:
            needed[ord(char) - ord("a")] += 1

        remaining = len(s1)
        for right, char in enumerate(s2):
            entering = ord(char) - ord("a")
            if needed[entering] > 0:
                remaining -= 1
            needed[entering] -= 1

            if right >= len(s1):
                leaving = ord(s2[right - len(s1)]) - ord("a")
                needed[leaving] += 1
                if needed[leaving] > 0:
                    remaining += 1

            if right + 1 >= len(s1) and remaining == 0:
                return True
        return False
```
