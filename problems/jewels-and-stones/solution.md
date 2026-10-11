## Approach

Store the jewel kinds in a hash set so membership tests are constant time. Then walk the owned stones once, incrementing a counter whenever the current character appears in the set. Case is preserved automatically since characters are compared exactly.

## Complexity Analysis

- **Time Complexity:** O(j + s) where j and s are the two string lengths.
- **Space Complexity:** O(j) for the jewel set.

## Implementation

```python
class Solution:
    def numJewelsInStones(self, jewels: str, stones: str) -> int:
        jewel_set = set(jewels)
        return sum(1 for c in stones if c in jewel_set)
```
