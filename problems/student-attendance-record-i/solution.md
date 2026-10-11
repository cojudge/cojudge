## Approach

Count absences and watch for three lates in a row in a single pass. Two absences or any occurrence of LLL disqualifies the record.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def checkRecord(self, s: str) -> bool:
        return s.count("A") < 2 and "LLL" not in s
```
