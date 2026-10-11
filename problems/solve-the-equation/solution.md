## Approach

Split the equation at `=` and fold each side into a pair of (x coefficient, constant) with a single left-to-right scan that tracks the current sign. A digit run followed by `x` adds to the coefficient (defaulting to 1 when no digits precede it); otherwise it adds to the constant. Subtracting the right pair from the left pair reduces the problem to `cx * x = cc`, which yields the three answer shapes directly.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the equation length. Each character is visited once.
- **Space Complexity:** O(1) beyond the input.

## Implementation

```python
class Solution:
    def solveEquation(self, equation: str) -> str:
        def parse(s):
            coeff = con = i = 0
            n = len(s)
            while i < n:
                sign = 1
                if s[i] == "+":
                    i += 1
                elif s[i] == "-":
                    sign = -1
                    i += 1
                num, has = 0, False
                while i < n and s[i].isdigit():
                    num = num * 10 + int(s[i])
                    i += 1
                    has = True
                if i < n and s[i] == "x":
                    coeff += sign * (num if has else 1)
                    i += 1
                else:
                    con += sign * num
            return coeff, con
        left, right = equation.split("=")
        lc, lcon = parse(left)
        rc, rcon = parse(right)
        cx, cc = lc - rc, rcon - lcon
        if cx == 0:
            return "Infinite solutions" if cc == 0 else "No solution"
        return f"x={cc // cx}"
```
