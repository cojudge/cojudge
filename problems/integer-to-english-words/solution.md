## Approach

Break the number into billions, millions, thousands, and remainder blocks of three digits. Convert each non-zero block under 1000 with a helper that handles hundreds plus tens/units via lookup tables, then join the block with its scale word.

## Complexity Analysis

- **Time Complexity:** O(1) — at most 4 blocks of constant work.
- **Space Complexity:** O(1) extra besides the output string.

## Implementation

```python
class Solution:
    def numberToWords(self, num: int) -> str:
        if num == 0:
            return "Zero"
        below20 = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
        tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

        def helper(n: int) -> str:
            parts = []
            if n >= 100:
                parts.append(below20[n // 100] + " Hundred")
                n %= 100
            if n >= 20:
                parts.append(tens[n // 10] + ("" if n % 10 == 0 else " " + below20[n % 10]))
            elif n > 0:
                parts.append(below20[n])
            return " ".join(parts)

        out = []
        for chunk, scale in ((num // 1000000000, "Billion"), ((num // 1000000) % 1000, "Million"), ((num // 1000) % 1000, "Thousand")):
            if chunk:
                out.append(helper(chunk) + " " + scale)
        if num % 1000:
            out.append(helper(num % 1000))
        return " ".join(out)
```
