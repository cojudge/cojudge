## Approach

Two numbers are digit-rearrangements of each other exactly when their sorted digit strings match. Powers of two up to the limit are few (2^0 through 2^30), so precompute their signatures once and check whether the signature of `n` appears among those of the same length.

## Complexity Analysis

- **Time Complexity:** O(d log d) per query, where d is the digit count, for sorting digits.
- **Space Complexity:** O(d) for the signature strings.

## Implementation

```python
class Solution:
    def reorderedPowerOf2(self, n: int) -> bool:
        sig = sorted(str(n))
        p = 1
        while p <= 10 ** 9:
            if sorted(str(p)) == sig:
                return True
            p <<= 1
        return False
```
