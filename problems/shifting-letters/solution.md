## Approach

Walk from the tail keeping the suffix sum modulo 26. At each index add `shifts[i]`, then rotate the letter forward by the accumulated total with wraparound. One reverse pass applies every prefix shift exactly once.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length.
- **Space Complexity:** O(n) for the mutable character array.

## Implementation

```python
from typing import List
class Solution:
    def shiftingLetters(self, s: str, shifts: List[int]) -> str:
        a = list(s)
        acc = 0
        for i in range(len(a) - 1, -1, -1):
            acc = (acc + shifts[i]) % 26
            a[i] = chr((ord(a[i]) - 97 + acc) % 26 + 97)
        return ''.join(a)
```
