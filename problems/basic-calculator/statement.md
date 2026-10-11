You are given a string `s` holding an arithmetic expression with non-negative integers, the operators `+` and `-`, parentheses `(` and `)`, and spaces. Evaluate the expression and return its integer value.

Division never appears. Numbers may have multiple digits, a minus may be unary (as in `-2` or `(-3+1)`), and the expression is always valid.

**Example 1:**
```
Input: s = "1 + 1"
Output: 2
Explanation: One plus one is two.
```

**Example 2:**
```
Input: s = " 2-1 + 2 "
Output: 3
Explanation: Spaces are ignored; 2 - 1 + 2 = 3.
```

**Example 3:**
```
Input: s = "(1+(4+5+2)-3)+(6+8)"
Output: 23
Explanation: The inner groups give 12 and 14; 1 + 11 - 3 = 9, then 9 + 14 = 23.
```

**Constraints:**
- `1 <= s.length <= 3 * 10^5`
- `s` consists of digits, `'+'`, `'-'`, `'('`, `')'` and spaces.
- Every number fits in a 32-bit signed integer and the result fits as well.
