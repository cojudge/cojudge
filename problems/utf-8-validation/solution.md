## Approach

Walk the bytes left to right, counting how many continuation bytes the current symbol still needs. A zero expectation means a new symbol starts: count its leading ones to learn the total length, rejecting a lone continuation prefix or a run longer than four. Otherwise the byte must carry the `10` prefix and decrement the debt. The stream is valid when no debt remains at the end.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of entries.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def validUtf8(self, data: List[int]) -> bool:
        need = 0
        for v in data:
            b = v & 0xFF
            if need == 0:
                if b >> 7 == 0:
                    continue
                ones = 0
                bit = 7
                while bit >= 0 and (b >> bit) & 1:
                    ones += 1
                    bit -= 1
                if ones == 1 or ones > 4:
                    return False
                need = ones - 1
            else:
                if b >> 6 != 0b10:
                    return False
                need -= 1
        return need == 0
```
