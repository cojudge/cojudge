## Approach

Scan from right to left while storing, in an ordered map, each value seen on the right together with its nearest index. For position i the odd-hop destination is the ceiling value and the even-hop destination is the floor value. Two boolean arrays record whether the end is reachable when it is our turn to make an odd hop or an even hop; they are filled using the destinations found in the map. The last cell is trivially reachable, and every other cell whose odd state is true contributes one good start.

## Complexity Analysis

- **Time Complexity:** O(n log n) for n ordered-map operations.
- **Space Complexity:** O(n) for the map and the two boolean arrays.

## Implementation

```python
from typing import List
import bisect
class Solution:
    def oddEvenJumps(self, arr: List[int]) -> int:
        n = len(arr)
        if n == 0:
            return 0
        odd = [False] * n
        even = [False] * n
        odd[-1] = even[-1] = True
        vals = sorted(set(arr))
        # map value -> nearest index to the right; maintain sorted values + dict
        pos = {arr[-1]: n - 1}
        import bisect
        sorted_vals = sorted(pos.keys())
        ans = 1
        for i in range(n - 2, -1, -1):
            # ceiling
            j = bisect.bisect_left(sorted_vals, arr[i])
            if j < len(sorted_vals):
                odd[i] = even[pos[sorted_vals[j]]]
            j2 = bisect.bisect_right(sorted_vals, arr[i]) - 1
            if j2 >= 0:
                even[i] = odd[pos[sorted_vals[j2]]]
            if odd[i]:
                ans += 1
            if arr[i] not in pos:
                bisect.insort(sorted_vals, arr[i])
            pos[arr[i]] = i
        return ans
```
