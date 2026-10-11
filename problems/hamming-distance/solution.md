## Approach

XOR-ing the two numbers produces a value whose binary 1-bits sit exactly at the positions where the inputs disagree. Counting those set bits therefore yields the Hamming distance directly.

## Complexity Analysis

- **Time Complexity:** O(1), a single XOR plus a population count over a fixed-width integer.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def hammingDistance(self, x: int, y: int) -> int:
        return bin(x ^ y).count("1")
```
