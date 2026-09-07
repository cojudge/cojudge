## Approach

If the total length of all matchsticks is not divisible by 4, a square is impossible. Otherwise each side must have length `target = total / 4`. Sort the sticks in descending order and place them greedily one at a time into one of four side buckets, backtracking when a bucket would overflow the target. Two optimizations make this fast: since large sticks are placed first, impossible configurations are pruned early; and skipping a bucket when it has the same current length as the previous bucket avoids trying symmetric arrangements of identical sides.

## Complexity Analysis

- **Time Complexity:** O(4^n) in the worst case before pruning, where n is the number of matchsticks; the descending-order sort and bucket-symmetry pruning keep it practical for n ≤ 15.
- **Space Complexity:** O(n) for the recursion stack.

## Implementation

```python
from typing import List


class Solution:
    def makesquare(self, matchsticks: List[int]) -> bool:
        total = sum(matchsticks)
        if total % 4 != 0:
            return False
        target = total // 4
        sticks = sorted(matchsticks, reverse=True)
        sides = [0] * 4

        def place(index: int) -> bool:
            if index == len(sticks):
                return sides[0] == sides[1] == sides[2] == sides[3] == target
            stick = sticks[index]
            for i in range(4):
                if sides[i] + stick > target:
                    continue
                if i > 0 and sides[i] == sides[i - 1]:
                    continue
                sides[i] += stick
                if place(index + 1):
                    return True
                sides[i] -= stick
            return False

        return place(0)
```