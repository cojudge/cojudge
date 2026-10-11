## Approach

Parse the text directly without building objects. Walk character by character, maintaining the current list depth (increment on `[`, decrement on `]`). When a number begins — an optional minus followed by digits — read the whole literal and add `value * depth` to the total. Commas are skipped. One pass yields the weighted sum.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the text length. Each character is handled once.
- **Space Complexity:** O(d) recursion depth, where d is the nesting level.

## Implementation

```python
class Solution:
    def depthSum(self, nestedList: str) -> int:
        self.s = nestedList
        self.i = 0
        def parse(depth):
            total = 0
            self.i += 1  # '['
            while self.i < len(self.s) and self.s[self.i] != ']':
                c = self.s[self.i]
                if c == ',':
                    self.i += 1
                elif c == '[':
                    total += parse(depth + 1)
                else:
                    sign = 1
                    if c == '-':
                        sign = -1
                        self.i += 1
                    num = 0
                    while self.i < len(self.s) and self.s[self.i].isdigit():
                        num = num * 10 + int(self.s[self.i])
                        self.i += 1
                    total += sign * num * depth
            self.i += 1  # ']'
            return total
        return parse(1)
```
