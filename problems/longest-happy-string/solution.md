## Approach

Track the remaining counts of `a`, `b`, and `c` along with the last two characters that were appended. Greedily append the letter with the largest remaining count that is not forbidden by the "last two" rule (a letter equal to both of the last two cannot be appended). Repeat until no letter can be added; the produced string is the longest possible happy string.

## Complexity Analysis

- **Time Complexity:** O((a + b + c) \* 3) = O(a + b + c).
- **Space Complexity:** O(1), excluding the output string.

## Implementation

```python
class Solution:
    def longestDiverseString(self, a: int, b: int, c: int) -> str:
        count = [a, b, c]
        result = []
        last = second_last = -1

        while True:
            best = -1
            for ch in range(3):
                if count[ch] == 0:
                    continue
                if ch == last and ch == second_last:
                    continue
                if best == -1 or count[ch] > count[best]:
                    best = ch
            if best == -1:
                break
            result.append(chr(ord("a") + best))
            count[best] -= 1
            second_last = last
            last = best
        return "".join(result)
```