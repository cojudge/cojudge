## Approach

Process the exponent digits left to right while keeping everything modulo 1337. Appending a digit `d` multiplies the previous exponent by ten and adds `d`, so update the answer as `ans = ans^10 * a^d`. Both powers use fast binary exponentiation after reducing the base.

## Complexity Analysis

- **Time Complexity:** O(m log 1337), where m is the number of digits in `b`; each digit needs two small modular powers.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def superPow(self, a: int, b: List[int]) -> int:
        MOD = 1337
        def pow_mod(x, e):
            r = 1 % MOD
            x %= MOD
            while e:
                if e & 1:
                    r = (r * x) % MOD
                x = (x * x) % MOD
                e >>= 1
            return r
        res = 1
        for d in b:
            res = pow_mod(res, 10)
            res = (res * pow_mod(a, d)) % MOD
        return res
```
