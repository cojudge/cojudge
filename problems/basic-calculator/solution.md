## Approach

Scan once while keeping the running total, the number being built, and its sign. Each `+` or `-` first folds the pending number into the total, then sets the new sign. An opening bracket pushes the enclosing total and sign and restarts both; a closing bracket folds the pending number, multiplies by the popped sign, and adds the popped total. This handles nesting and unary minus without recursion.

## Complexity Analysis

- **Time Complexity:** O(n), a single left-to-right scan.
- **Space Complexity:** O(n) for the stack in the worst case of deep nesting.

## Implementation

```python
class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        result = 0
        num = 0
        sign = 1
        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == "+":
                result += sign * num
                num = 0
                sign = 1
            elif c == "-":
                result += sign * num
                num = 0
                sign = -1
            elif c == "(":
                stack.append(result)
                stack.append(sign)
                result = 0
                sign = 1
            elif c == ")":
                result += sign * num
                num = 0
                result *= stack.pop()
                result += stack.pop()
        return result + sign * num
```
