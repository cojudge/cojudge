## Approach

Evaluate with a small recursive-descent parser mirroring precedence. An expression combines terms with plus and minus, a term combines factors with multiply and divide, and a factor consumes an optional unary sign followed by either a parenthesized expression or a decimal number. Spaces are skipped everywhere, and integer division truncates toward zero.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the string length; each character is consumed once.
- **Space Complexity:** O(d) for recursion depth d (parenthesis nesting).

## Implementation

```python
class Solution:
    def calculate(self, s: str) -> int:
        n = len(s)
        pos = [0]
        def skip():
            while pos[0] < n and s[pos[0]] == ' ':
                pos[0] += 1
        def parse_expr():
            v = parse_term()
            while True:
                skip()
                if pos[0] < n and s[pos[0]] in '+-':
                    op = s[pos[0]]
                    pos[0] += 1
                    t = parse_term()
                    v = v + t if op == '+' else v - t
                else:
                    break
            return v
        def parse_term():
            v = parse_factor()
            while True:
                skip()
                if pos[0] < n and s[pos[0]] in '*/':
                    op = s[pos[0]]
                    pos[0] += 1
                    f = parse_factor()
                    if op == '*':
                        v = v * f
                    else:
                        v = abs(v) // abs(f) * (1 if (v >= 0) == (f >= 0) else -1) if f != 0 else 0
                else:
                    break
            return v
        def parse_factor():
            skip()
            if pos[0] < n and s[pos[0]] in '+-':
                op = s[pos[0]]
                pos[0] += 1
                f = parse_factor()
                return -f if op == '-' else f
            if pos[0] < n and s[pos[0]] == '(':
                pos[0] += 1
                v = parse_expr()
                skip()
                if pos[0] < n and s[pos[0]] == ')':
                    pos[0] += 1
                return v
            num = 0
            has = False
            while pos[0] < n and s[pos[0]].isdigit():
                num = num * 10 + int(s[pos[0]])
                pos[0] += 1
                has = True
            return num if has else 0
        return parse_expr()
```
