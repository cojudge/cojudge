## Approach

Process the two strings from the least significant (rightmost) digit toward the most significant, column by column. At each step add the two bits and the incoming carry: the resulting bit is `sum % 2` and the new carry is `sum / 2`. Keep going until both strings are exhausted and the carry is cleared, then reverse the accumulated result.

## Complexity Analysis

- **Time Complexity:** O(max(a.length, b.length)).
- **Space Complexity:** O(max(a.length, b.length)) for the output string.

## Implementation

```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        i, j = len(a) - 1, len(b) - 1
        carry = 0
        result = []
        while i >= 0 or j >= 0 or carry:
            total = carry
            if i >= 0:
                total += int(a[i])
                i -= 1
            if j >= 0:
                total += int(b[j])
                j -= 1
            result.append(str(total % 2))
            carry = total // 2
        return ''.join(reversed(result))
```