## Approach

Every ugly number after 1 is 2, 3 or 5 times an earlier ugly number. Build the sequence in order with three pointers marking the next unused multiple of 2, 3 and 5. Repeatedly take the smallest candidate as the next ugly number and advance every pointer that produced it, which keeps the list sorted and duplicate-free.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n) for the generated list.

## Implementation

```python
class Solution:
    def nthUglyNumber(self, n: int) -> int:
        ugly = [1]
        i2 = i3 = i5 = 0
        for _ in range(1, n):
            nxt = min(ugly[i2] * 2, ugly[i3] * 3, ugly[i5] * 5)
            ugly.append(nxt)
            if nxt == ugly[i2] * 2:
                i2 += 1
            if nxt == ugly[i3] * 3:
                i3 += 1
            if nxt == ugly[i5] * 5:
                i5 += 1
        return ugly[-1]
```
