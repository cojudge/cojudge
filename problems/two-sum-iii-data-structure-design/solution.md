## Approach

Keep a frequency table of added numbers. Adding increments a count. Finding scans the stored keys for a complement that sums to the target, insisting on two copies when both addends are equal. Each `find` is reported as `"true"` or `"false"`, while construction and `add` report `"null"`; the full per-operation trace is compared exactly against the reference.

## Complexity Analysis

- **Time Complexity:** O(1) per `add`, O(d) per `find` where d is the number of distinct stored values.
- **Space Complexity:** O(d) for the frequency table.

## Implementation

```python
class TwoSum:
    def __init__(self):
        self.counts = {}

    def add(self, number: int) -> None:
        self.counts[number] = self.counts.get(number, 0) + 1

    def find(self, value: int) -> bool:
        for x, c in self.counts.items():
            need = value - x
            if need == x:
                if c >= 2:
                    return True
            elif need in self.counts:
                return True
        return False
```
