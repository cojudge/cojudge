Given a non-negative integer `n`, count how many times the digit `1` appears across every integer from `0` to `n` inclusive.

For instance, when `n` is `13`, the digit `1` shows up in `1`, `10`, `11` (twice), `12`, and `13`, for a total of `6` occurrences.

Return that total count.

**Example 1:**
```
Input: n = 13
Output: 6
Explanation: The digit 1 occurs once each in 1, 10, 12, 13, and twice in 11.
```

**Example 2:**
```
Input: n = 0
Output: 0
Explanation: The only value considered is 0, which contains no digit 1.
```

**Constraints:**
- `0 <= n <= 10^9`
