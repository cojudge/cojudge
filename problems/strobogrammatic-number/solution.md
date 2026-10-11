## Approach

Place two pointers at the string ends and move them inward. Each left character must have a valid rotation that equals the mirrored right character, using the pairs 0-0, 1-1, 6-9, 8-8, and 9-6. The first violation rejects the string; surviving all pairs accepts it.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length. Each character is checked once.
- **Space Complexity:** O(1), only the fixed rotation table.

## Implementation

```python
class Solution:
    def isStrobogrammatic(self, num: str) -> bool:
        rot = {"0": "0", "1": "1", "6": "9", "8": "8", "9": "6"}
        i, j = 0, len(num) - 1
        while i <= j:
            if num[i] not in rot or rot[num[i]] != num[j]:
                return False
            i += 1
            j -= 1
        return True
```
