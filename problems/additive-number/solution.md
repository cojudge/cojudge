## Approach

Enumerate the lengths of the first two numbers (respecting the no-leading-zero rule), then verify the forced sums match the rest of the string using string addition.

## Complexity Analysis

- **Time Complexity:** O(n^3)
- **Space Complexity:** O(n)

## Implementation

```python
class Solution:
    def isAdditiveNumber(self, num: str) -> bool:
        n = len(num)
        def add_str(x: str, y: str) -> str:
            i, j, carry, out = len(x) - 1, len(y) - 1, 0, []
            while i >= 0 or j >= 0 or carry:
                s = carry
                if i >= 0:
                    s += ord(x[i]) - 48
                    i -= 1
                if j >= 0:
                    s += ord(y[j]) - 48
                    j -= 1
                out.append(chr(48 + s % 10))
                carry = s // 10
            return ''.join(reversed(out))
        for i in range(1, n):
            if i > 1 and num[0] == '0':
                break
            for j in range(1, n - i):
                if j > 1 and num[i] == '0':
                    break
                x, y, k = num[:i], num[i:i + j], i + j
                while k < n:
                    z = add_str(x, y)
                    if not num.startswith(z, k):
                        break
                    k += len(z)
                    x, y = y, z
                else:
                    return True
        return False
```
