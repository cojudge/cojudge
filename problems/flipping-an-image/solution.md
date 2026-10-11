## Approach

Build a fresh matrix where each output cell copies the horizontally mirrored input cell with its bit flipped. Reading row i from right to left while writing left to right combines the mirror and the inversion in a single pass, and XOR with 1 performs the bit flip.

## Complexity Analysis

- **Time Complexity:** O(n*m) for an n by m matrix.
- **Space Complexity:** O(n*m) for the result matrix.

## Implementation

```python
from typing import List

class Solution:
    def flipAndInvertImage(self, image: List[List[int]]) -> List[List[int]]:
        return [[cell ^ 1 for cell in row[::-1]] for row in image]
```
