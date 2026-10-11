You receive a parenthesized digit string such as `"(123)"`. Imagine removing the parentheses, cutting the remaining digits into two non-empty halves, and optionally inserting one decimal point inside each half to form two numbers. List every distinct coordinate pair that follows the standard numeric spelling rules.

A half without a dot is legal when it is exactly `"0"` or does not start with `0`. A half with a dot `"A.B"` is legal when `A` is `"0"` or has no leading zero, and `B` does not end with `0` (so no trailing zeros after the point). Report each pair as `"(left, right)"`.

Adaptation note: this task uses the portable `string_list` output type; ordering is ignored during judging (lists are compared sorted).

**Constraints:**
- `4 <= s.length <= 12`
- `s` starts with `(` and ends with `)`.
- The inside holds only digits `0-9`.
