## Approach

Simulate walking through the rows in a down-then-up cycle. Keep one string builder per row and append each character to the current row. Reverse direction at the top row and the bottom row. When there is only one row, the walk never moves, so the input is returned unchanged. Finally concatenate the rows.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each character is visited once.
- **Space Complexity:** O(n) for the row buffers and the output.

## Implementation

```python
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        if numRows == 1 or len(s) <= numRows:
            return s
        rows = ["" for _ in range(numRows)]
        cur = 0
        down = True
        for c in s:
            rows[cur] += c
            if cur == 0:
                down = True
            elif cur == numRows - 1:
                down = False
            cur += 1 if down else -1
        return "".join(rows)
```
