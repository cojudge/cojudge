## Approach

Walk down the grade thresholds from A to D with an if / else-if chain. The first threshold the score meets gives the grade, and anything below 60 is an F.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def gradeLetter(self, score: int) -> str:
        if score >= 90:
            return "A"
        if score >= 80:
            return "B"
        if score >= 70:
            return "C"
        if score >= 60:
            return "D"
        return "F"
```
