## Approach

Pairing each letter of the shorter string with an equal letter of the longer one leaves exactly one unpaired letter. XOR-ing all character codes cancels the pairs and exposes the leftover code, which is converted to a one-character string. (Summing codes and subtracting works equally well.)

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `t`.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def findTheDifference(self, s: str, t: str) -> str:
        x = 0
        for c in s:
            x ^= ord(c)
        for c in t:
            x ^= ord(c)
        return chr(x)
```
