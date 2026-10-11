## Approach

Sort the greed factors and the cookie sizes. Then sweep through the cookies from smallest to largest, always offering the current cookie to the least greedy child who is still waiting. Whenever a cookie is big enough, count one more content child and move to the next child; otherwise skip the cookie. This greedy pairing is optimal because using the smallest fitting cookie never harms future assignments.

## Complexity Analysis

- **Time Complexity:** O(n log n + m log m), dominated by sorting the two arrays.
- **Space Complexity:** O(1) extra space besides sorting.

## Implementation

```python
class Solution:
    def findContentChildren(self, g: list, s: list) -> int:
        g = sorted(g)
        s = sorted(s)
        child = 0
        for cookie in s:
            if child < len(g) and cookie >= g[child]:
                child += 1
        return child
```
