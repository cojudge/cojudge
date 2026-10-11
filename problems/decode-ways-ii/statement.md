A message uses `A=1` through `Z=26`. The string `s` may also hold `'*'`, which stands for any single digit `1..9`. Count how many original messages could produce `s` under the usual split rules: every chunk is `1..26`, and a chunk never starts with `0`.

Return the count modulo `1_000_000_007`.

**Example 1:**
```
Input: s = "*"
Output: 9
Explanation: Any digit 1 through 9 forms one valid letter.
```

**Example 2:**
```
Input: s = "1*"
Output: 18
Explanation: '1' pairs with each of the 9 options, and '11'..'19' are all valid pairs, giving 9 + 9.
```

**Example 3:**
```
Input: s = "2*"
Output: 15
Explanation: 9 single-step options plus the pairs '21'..'26' (6 options).
```

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` holds only digits and `'*'`.
