## Approach

Apply grade-school multiplication directly to the input digits. Store each single-digit product and its carry in an array of length `len(num1) + len(num2)`, where digits at indices `i` and `j` contribute to positions `i + j` and `i + j + 1`. Convert the normalized digit array to a canonical string after removing leading zeroes.

## Complexity Analysis

- **Time Complexity:** O(m * n), where m and n are the two string lengths.
- **Space Complexity:** O(m + n) for the product digits and returned string.

## Implementation

```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == "0" or num2 == "0":
            return "0"

        digits = [0] * (len(num1) + len(num2))
        for i in range(len(num1) - 1, -1, -1):
            for j in range(len(num2) - 1, -1, -1):
                position = i + j + 1
                value = int(num1[i]) * int(num2[j]) + digits[position]
                digits[position] = value % 10
                digits[position - 1] += value // 10

        return "".join(str(digit) for digit in digits).lstrip("0") or "0"
```
