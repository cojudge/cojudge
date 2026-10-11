## Approach

Walk the digits from right to left while folding `k` into a running carry.
At each position add the current digit to the carry, record `carry % 10`, and
keep `carry / 10` for the next step. The loop continues while digits or a
nonzero carry remain, so an overflowing carry naturally produces an extra
leading digit. Digits are collected backwards and reversed once at the end.

## Complexity Analysis

- **Time Complexity:** O(max(n, log k)), where n is the length of `num`. Each digit is visited once.
- **Space Complexity:** O(n) for the answer list.

## Implementation

```python
from typing import List
class Solution:
    def addToArrayForm(self, num: List[int], k: int) -> List[int]:
        ans = []
        i = len(num) - 1
        carry = k
        while i >= 0 or carry > 0:
            if i >= 0:
                carry += num[i]
                i -= 1
            ans.append(carry % 10)
            carry //= 10
        ans.reverse()
        return ans
```
