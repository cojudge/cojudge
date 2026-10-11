## Approach

Walk the array from right to left while maintaining a decreasing stack of candidates for the large middle position `nums[j]`. Whenever the current value exceeds the stack top, pop it and remember the biggest popped value as the best achievable `nums[k]` seen so far. If the current value is smaller than that remembered `nums[k]`, the three positions form the required small-large-middle ordering.

## Complexity Analysis

- **Time Complexity:** O(n), since each element is pushed and popped at most once.
- **Space Complexity:** O(n) for the stack in the worst case.

## Implementation

```python
class Solution:
    def find132pattern(self, nums: list) -> bool:
        st = []
        third = float("-inf")
        for v in reversed(nums):
            if v < third:
                return True
            while st and v > st[-1]:
                third = st.pop()
            st.append(v)
        return False
```
