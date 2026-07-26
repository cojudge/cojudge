## Approach

Map every digit to its keypad letters and backtrack through the digit positions. At each position, append one mapped letter and recurse to the next digit. A path that reaches the end is one complete combination.

## Complexity Analysis

- **Time Complexity:** O(L * C), where `L` is the number of digits and `C` is the number of generated combinations.
- **Space Complexity:** O(L) auxiliary recursion and path space, excluding the O(L * C) output.

## Implementation

```python
from typing import List


class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        letters = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "pqrs",
            "8": "tuv",
            "9": "wxyz",
        }
        result: List[str] = []
        current: List[str] = []

        def backtrack(index: int) -> None:
            if index == len(digits):
                result.append("".join(current))
                return
            for char in letters[digits[index]]:
                current.append(char)
                backtrack(index + 1)
                current.pop()

        backtrack(0)
        return result
```
