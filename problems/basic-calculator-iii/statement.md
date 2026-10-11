Implement a calculator for the string `s`, which holds non-negative integers, the four operators `+`, `-`, `*`, `/`, parentheses `(` `)`, and spaces. Division between integers discards any fractional part toward zero (for example `5 / 2` is `2` and `-5 / 2` is `-2`).

Evaluate using the standard order: innermost parentheses first, then multiplication and division left to right, then addition and subtraction left to right. A leading minus or a minus right after `(` acts as a unary negation.

Return the integer result. This is a portable string adaptation: the formula travels as a plain string and the answer is a plain integer.

**Example 1:**
```
Input: s = "1+1"
Output: 2
Explanation: One plus one is two.
```

**Example 2:**
```
Input: s = "6-4/2"
Output: 4
Explanation: 4/2 is 2, then 6 - 2 is 4.
```

**Example 3:**
```
Input: s = "2*(5+5*2)/3+(6/2+8)"
Output: 21
Explanation: The inner 5+10 is 15; 2*15 is 30; 30/3 is 10; 6/2+8 is 11; 10+11 is 21.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` holds only digits, `+`, `-`, `*`, `/`, `(`, `)`, and spaces
- `s` is a valid expression; division by zero never occurs
- Intermediate results fit in a signed 32-bit integer
