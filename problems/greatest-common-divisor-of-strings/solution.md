## Approach

A common divisor must be a prefix of both strings. The key observation: a string `x` can divide both `str1` and `str2` only if `str1 + str2 == str2 + str1`. If that fails, no common divisor exists. Otherwise, the largest such string is the prefix of length `gcd(str1.length, str2.length)` of either string.

To check divisibility directly: `x` divides a string of length `L` iff `L % x.length == 0` and the string equals `x` repeated `L / x.length` times.

## Complexity Analysis

- **Time Complexity:** O(min(str1.length, str2.length)) for the string comparison, plus O(log(min len)) for the GCD computation. String concatenation comparisons are O(str1.length + str2.length).
- **Space Complexity:** O(str1.length + str2.length) for the temporary concatenations (or O(1) with a direct divisibility check).

## Implementation

```python
from math import gcd

class Solution:
    def gcdOfStrings(self, str1: str, str2: str) -> str:
        if str1 + str2 != str2 + str1:
            return ""
        return str1[:gcd(len(str1), len(str2))]
```