## Approach

Align the strings at their right ends and add column by column with a carry. Each step combines the two current digits plus the incoming carry, emits the units digit, and forwards the tens digit. When both strings and the carry are exhausted, reversing the collected digits gives the sum.

## Complexity Analysis

- **Time Complexity:** O(max(n, m)), where n and m are the input lengths.
- **Space Complexity:** O(max(n, m)) for the output.

## Implementation

```python
class Solution:
    def addStrings(self, num1: str, num2: str) -> str:
        i, j = len(num1) - 1, len(num2) - 1
        carry = 0
        out = []
        while i >= 0 or j >= 0 or carry:
            a = ord(num1[i]) - 48 if i >= 0 else 0
            b = ord(num2[j]) - 48 if j >= 0 else 0
            s = a + b + carry
            out.append(chr(48 + s % 10))
            carry = s // 10
            i -= 1
            j -= 1
        return "".join(reversed(out))
```
