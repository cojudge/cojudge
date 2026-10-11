Divide `numerator` by `denominator` and write the result as a decimal string. When the fractional part repeats forever, wrap the repeating block in parentheses.

For example, `1 / 2` is `"0.5"`, while `4 / 333` repeats `"012"` and becomes `"0.(012)"`. A negative result carries a single leading minus sign, and an exact division shows no decimal point.

**Example 1:**
```
Input: numerator = 1, denominator = 2
Output: "0.5"
Explanation: One half is exactly 0.5.
```

**Example 2:**
```
Input: numerator = 2, denominator = 1
Output: "2"
Explanation: The division is exact, so no decimal point appears.
```

**Example 3:**
```
Input: numerator = 4, denominator = 333
Output: "0.(012)"
Explanation: The digits 012 repeat forever.
```

**Constraints:**
- `-2^31 <= numerator, denominator <= 2^31 - 1`
- `denominator != 0`
