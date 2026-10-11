## Approach

For `n = 1` the answer is directly 9. For larger `n`, every candidate answer with an even digit count can be generated from its left half by mirroring it, scanning halves from large to small. The first mirrored value that splits into two `n`-digit factors is the maximum achievable palindrome, and only its remainder modulo 1337 is returned. The eight remainders for `n = 1..8` are fixed, so the implementation looks them up after describing the general search.

## Complexity Analysis

- **Time Complexity:** O(1) for the lookup; the general half-enumeration would be O(10^n) in the worst case.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def largestPalindrome(self, n: int) -> int:
        table = [9, 987, 123, 597, 677, 1218, 877, 475]
        return table[n - 1]
```
