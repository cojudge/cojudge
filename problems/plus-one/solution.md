## Approach

Copy the input and scan its digits from right to left. Increment the first digit smaller than `9`; every trailing `9` becomes `0` while the carry continues. If every digit was `9`, prepend a new leading `1`.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of digits.
- **Space Complexity:** O(n) for the returned digit array.

## Implementation

```python
from typing import List


class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        result = digits[:]
        for index in range(len(result) - 1, -1, -1):
            if result[index] < 9:
                result[index] += 1
                return result
            result[index] = 0
        return [1] + result
```
