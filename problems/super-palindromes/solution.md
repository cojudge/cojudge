## Approach

Any super-palindrome below `10^18` has a palindromic root below `10^9`. Such roots are fully described by their left half: mirroring the half yields both odd-length and even-length candidates. Trying halves from `1` to `100000` (covering all roots up to `10^9` when mirrored) produces every possible square; keeping those whose square reads as a palindrome builds the complete catalogue once. Each query then counts catalogue entries inside `[left, right]`.

## Complexity Analysis

- **Time Complexity:** O(H * L) with H = 1e5 halves and L digits for palindrome checks, once; each query scans the small catalogue.
- **Space Complexity:** O(1) besides the catalogue of a few dozen values.

## Implementation

```python
class Solution:
    def superpalindromesInRange(self, left: str, right: str) -> int:
        def is_pal(x: int) -> bool:
            s = str(x)
            return s == s[::-1]
        cands = set()
        for half in range(1, 100000):
            h = str(half)
            r = h[::-1]
            for root in (int(h + r[1:]), int(h + r)):
                sq = root * root
                if sq < 10 ** 18 and is_pal(sq):
                    cands.add(sq)
        L, R = int(left), int(right)
        return sum(1 for v in cands if L <= v <= R)
```
