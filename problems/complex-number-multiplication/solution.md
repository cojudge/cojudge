## Approach

Split each operand at the `+` separator: the text before it is the real part and the text after it (minus the trailing `i`) is the imaginary part. Parse both to integers, combine them with the complex product rule (real `a*c-b*d`, imaginary `a*d+b*c`), and format the result with the same `+` separator.

## Complexity Analysis

- **Time Complexity:** O(L), where L is the input length, for splitting and parsing.
- **Space Complexity:** O(L) for the intermediate strings.

## Implementation

```python
class Solution:
    def complexNumberMultiply(self, num1: str, num2: str) -> str:
        def parse(s):
            plus = s.index('+')
            return int(s[:plus]), int(s[plus+1:-1])
        a, b = parse(num1)
        c, d = parse(num2)
        return f"{a*c-b*d}+{a*d+b*c}i"
```
