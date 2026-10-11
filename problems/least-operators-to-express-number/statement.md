Write down the integer `x` several times in a row, placing one operator — `+`, `-`, `*` or `/` — between each pair of neighbours, forming one flat chain with no parentheses anywhere. The chain is scored by evaluating it with the usual precedence (multiplication and division before addition and subtraction); division produces exact rational values, and a leading minus sign is forbidden.

Using as few operators as possible, build a chain whose value equals `target`, and return that smallest operator count.

**Example 1:**
```
Input: x = 3, target = 19
Output: 5
Explanation: The flat chain 3*3+3*3+3/3 evaluates to 9+9+1 with 5 operators, and nothing shorter reaches 19.
```

**Example 2:**
```
Input: x = 5, target = 501
Output: 8
Explanation: The chain 5*5*5*5-5*5*5+5/5 evaluates to 625-125+1 with 8 operators, which is optimal.
```

**Example 3:**
```
Input: x = 100, target = 100000000
Output: 3
Explanation: The target equals 100^4, built with 3 multiplications and nothing else.
```

**Constraints:**
- `2 <= x <= 100`
- `1 <= target <= 10^9`
