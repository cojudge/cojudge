## Approach

Pair each of the 13 usable values (the seven symbols plus the six subtractive forms) with its text, ordered from largest to smallest. Repeatedly append the biggest value that still fits and subtract it from the remainder until nothing is left. Greedy works here because every Roman value is a canonical building block of the ones below it.

## Complexity Analysis

- **Time Complexity:** O(1), since `num <= 3999` bounds the output to at most 15 characters.
- **Space Complexity:** O(1) besides the output string.

## Implementation

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        table = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
                 (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
                 (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
        out = []
        for value, sym in table:
            while num >= value:
                out.append(sym)
                num -= value
        return "".join(out)
```
