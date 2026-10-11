## Approach

Simulate matching `s2` cyclically against repeated copies of `s1`, tracking how many full `s2` copies complete and where inside `s2` each copy of `s1` ends. The end offset has only `len(s2)` possible values, so it must repeat: once an offset recurs, the segment between the two occurrences is a cycle. Measure the cycle's length and yield, skip all whole cycles with arithmetic, handle the leftover copies directly, and finally divide by `n2`.

## Complexity Analysis

- **Time Complexity:** O(|s1| * |s2|), since a repeat is forced within `|s2| + 1` copies of `s1`.
- **Space Complexity:** O(|s2| + n1) for the offset table and per-copy counts.

## Implementation

```python
class Solution:
    def getMaxRepetitions(self, s1: str, n1: int, s2: str, n2: int) -> int:
        if n1 == 0:
            return 0
        reps = [0] * (n1 + 1)
        seen = {}
        j = 0
        cnt = 0
        for k in range(1, n1 + 1):
            for ch in s1:
                if ch == s2[j]:
                    j += 1
                    if j == len(s2):
                        j = 0
                        cnt += 1
            reps[k] = cnt
            if j in seen:
                pk, pcnt = seen[j]
                cycle_len = k - pk
                cycle_cnt = cnt - pcnt
                remaining = n1 - pk
                total = pcnt + (remaining // cycle_len) * cycle_cnt
                total += reps[pk + (remaining % cycle_len)] - pcnt
                return total // n2
            seen[j] = (k, cnt)
        return reps[n1] // n2
```
