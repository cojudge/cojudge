## Approach

Try every index as a possible loop entry. From a start, follow the jumps while each visited value keeps the starting direction, remembering every index seen on the current walk. Landing on an index already in the walk (through a genuine move to a different index) reveals a same-direction cycle, so return true. If the walk changes direction, stalls on one index, or runs out of steps, move on to the next start.

## Complexity Analysis

- **Time Complexity:** O(n^2), since each of the n walks takes at most n steps.
- **Space Complexity:** O(n) for the set of visited indices on one walk.

## Implementation

```python
class Solution:
    def circularArrayLoop(self, nums: list) -> bool:
        n = len(nums)
        for start in range(n):
            fwd = nums[start] > 0
            seen = {start}
            cur = start
            for _ in range(n):
                if (nums[cur] > 0) != fwd:
                    break
                nxt = (cur + nums[cur]) % n
                if nxt == cur:
                    break
                if nxt in seen:
                    return True
                seen.add(nxt)
                cur = nxt
        return False
```
