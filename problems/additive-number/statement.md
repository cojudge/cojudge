A string of digits is additive when it can be split into at least three numbers where every
number from the third on equals the sum of the previous two (like 1, 1, 2, 3, 5). Numbers
may not carry leading zeros unless the number itself is exactly `"0"`. Decide whether the
given digit string `num` is additive.

**Example 1:**
```
Input: num = "112358"
Output: true
Explanation: 1, 1, 2, 3, 5 each extend the running sum.
```

**Example 2:**
```
Input: num = "199100199"
Output: true
Explanation: 1, 99, 100, 199 follows the rule.
```

**Example 3:**
```
Input: num = "1023"
Output: false
Explanation: No split of at least three valid numbers fits the rule.
```

**Constraints:**
- `1 <= num.length <= 35`
- `num` contains only digits.
