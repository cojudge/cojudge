## Approach

Make one pass while remembering the pending operator and the number being built. Whenever an operator (or the end of input) is reached, apply the *previous* operator: `+`/`-` bank the current term into the result and start a new signed term, while `*`/`/` merge directly into the current term. This gives multiplication and division their higher precedence with constant memory, and the final term is added at the end.

## Complexity Analysis

- **Time Complexity:** O(n), a single scan.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def calculate(self, s: str) -> int:
        result = 0
        last = 0
        num = 0
        op = "+"
        for i, c in enumerate(s):
            if c.isdigit():
                num = num * 10 + int(c)
            if (not c.isdigit() and c != " ") or i == len(s) - 1:
                if op == "+":
                    result += last
                    last = num
                elif op == "-":
                    result += last
                    last = -num
                elif op == "*":
                    last = last * num
                elif op == "/":
                    last = int(last / num)
                op = c
                num = 0
        return result + last
```
