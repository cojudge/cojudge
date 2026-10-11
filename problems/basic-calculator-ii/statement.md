You are given a string `s` holding an arithmetic expression with non-negative integers and the operators `+`, `-`, `*` and `/`, plus spaces. There are no parentheses. Multiplication and division bind tighter than addition and subtraction, and division truncates toward zero.

Evaluate the expression and return its integer value. The expression is always valid and every intermediate value fits in a 32-bit signed integer.

**Example 1:**
```
Input: s = "3+2*2"
Output: 7
Explanation: The product 2*2 = 4 is computed first, then 3 + 4 = 7.
```

**Example 2:**
```
Input: s = " 3/2 "
Output: 1
Explanation: 3/2 = 1.5, truncated toward zero to 1.
```

**Example 3:**
```
Input: s = " 3+5 / 2 "
Output: 5
Explanation: 5/2 truncates to 2, then 3 + 2 = 5.
```

**Constraints:**
- `1 <= s.length <= 3 * 10^5`
- `s` consists of digits, `'+'`, `'-'`, `'*'`, `'/'` and spaces.
