A non-negative integer has monotone digits when each digit (read left to right) is greater than or equal to the previous one — for instance `123`, `1123` and `7` qualify, while `132` and `1000` do not.

Given `n`, return the largest integer that is less than or equal to `n` and has monotone digits.

**Example 1:**
```
Input: n = 10
Output: 9
Explanation: 10 itself dips from 1 to 0, so the best valid value below it is 9.
```

**Example 2:**
```
Input: n = 1234
Output: 1234
Explanation: The digits never decrease, so n is already valid.
```

**Example 3:**
```
Input: n = 332
Output: 299
Explanation: Lowering the middle digit and filling the tail with 9s gives the closest valid value.
```

**Constraints:**
- `0 <= n <= 10^9`
