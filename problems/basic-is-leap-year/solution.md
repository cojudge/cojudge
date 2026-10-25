## Approach

Handle the century exception first: multiples of 400 are leap years while other multiples of 100 are not. Any remaining year is a leap year exactly when divisible by 4.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isLeapYear(self, year: int) -> bool:
        if year % 400 == 0:
            return True
        if year % 100 == 0:
            return False
        return year % 4 == 0
```
