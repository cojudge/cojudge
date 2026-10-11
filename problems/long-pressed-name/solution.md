## Approach

Walk through `typed` with two pointers. Keep an index into `name`; when the current typed character matches the current name character, advance the name pointer. Otherwise the typed character must repeat the previous typed character, or the answer is false. At the end every name character must have been consumed.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the lengths of `name` and `typed`. Each string is scanned once.
- **Space Complexity:** O(1) besides the inputs.

## Implementation

```python
class Solution:
    def isLongPressedName(self, name: str, typed: str) -> bool:
        i = 0
        for j, c in enumerate(typed):
            if i < len(name) and c == name[i]:
                i += 1
            elif j == 0 or c != typed[j - 1]:
                return False
        return i == len(name)
```
