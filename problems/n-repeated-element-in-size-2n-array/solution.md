## Approach

The repeated value is the only one occurring more than once, so a single pass counting frequencies (or even comparing neighbours a few steps apart) reveals it. The counting version tallies each value in a hash map and returns the first value whose count exceeds one.

## Complexity Analysis

- **Time Complexity:** O(n) for one pass over the array.
- **Space Complexity:** O(n) for the frequency table.

## Implementation

```python
class Solution:
    def repeatedNTimes(self, nums: list[int]) -> int:
        freq = {}
        for v in nums:
            freq[v] = freq.get(v, 0) + 1
        for v, c in freq.items():
            if c > 1:
                return v
        return nums[0]
```
