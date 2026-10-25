## Approach

Compare the temperature against each boundary starting from the coldest. The first boundary it falls below selects the label, and anything reaching 25 is Hot.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def tempAdvice(self, t: int) -> str:
        if t < 0:
            return "Freezing"
        if t < 15:
            return "Cold"
        if t < 25:
            return "Warm"
        return "Hot"
```
