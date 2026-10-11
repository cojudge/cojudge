## Approach

Parse the serialization with a small recursive reader: on `[` consume elements until the matching `]`, skipping commas; on a digit or minus sign read the full integer and append it. Because elements are visited strictly left to right and sublists are expanded in place, appended integers already appear in flattened order, matching exactly what successive iterator steps would emit.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the text length. Each character is consumed once.
- **Space Complexity:** O(d + m), with d nesting depth for recursion and m integers of output.

## Implementation

```python
from typing import List
class Solution:
    def flattenNestedList(self, nestedList: str) -> List[int]:
        self.s = nestedList
        self.i = 0
        out = []
        def parse():
            if self.i >= len(self.s):
                return
            if self.s[self.i] == '[':
                self.i += 1
                while self.i < len(self.s) and self.s[self.i] != ']':
                    if self.s[self.i] == ',':
                        self.i += 1
                    else:
                        parse()
                self.i += 1
            else:
                sign = 1
                if self.s[self.i] == '-':
                    sign = -1
                    self.i += 1
                num = 0
                while self.i < len(self.s) and self.s[self.i].isdigit():
                    num = num * 10 + int(self.s[self.i])
                    self.i += 1
                out.append(sign * num)
        parse()
        return out
```
