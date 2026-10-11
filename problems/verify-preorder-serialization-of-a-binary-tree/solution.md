## Approach

Imagine each token must occupy one open child slot. Begin with a single slot for the root. Reading left to right, every token consumes a slot; a numeric token additionally opens two fresh slots for its own children while `#` opens none. Dropping below zero means a token arrived with nowhere to attach, and leftover slots at the end mean the tree is incomplete. Only an exact zero balance is valid.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the string. Tokens are scanned once.
- **Space Complexity:** O(n) for the split tokens, or O(1) with manual scanning.

## Implementation

```python
class Solution:
    def isValidSerialization(self, preorder: str) -> bool:
        slots = 1
        for tok in preorder.split(","):
            slots -= 1
            if slots < 0:
                return False
            if tok != "#":
                slots += 2
        return slots == 0
```
