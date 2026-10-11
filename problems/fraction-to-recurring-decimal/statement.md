Divide `numerator` by `denominator` and write the result as a decimal string. When the fractional part repeats forever, wrap the repeating block in parentheses.

For example, `1 / 2` is `"0.5"`, while `4 / 333` repeats `"012"` and becomes `"0.(012)"`. A negative result carries a single leading minus sign, and an exact division shows no decimal point.

**Constraints:**
- `-2^31 <= numerator, denominator <= 2^31 - 1`
- `denominator != 0`
