There are `n` lamps in a row, all starting switched on. Four buttons are available:

- flip every lamp,
- flip lamps at even positions,
- flip lamps at odd positions,
- flip lamps whose position leaves remainder 1 when divided by 3 (positions 1, 4, 7, ...).

Press any button exactly `presses` times in total (the same button may be pressed repeatedly). Return how many distinct on/off patterns can result.

**Example 1:**
```
Input: n = 1, presses = 1
Output: 2
Explanation: The single lamp can finish on or off.
```

**Example 2:**
```
Input: n = 2, presses = 1
Output: 3
```

**Example 3:**
```
Input: n = 3, presses = 1
Output: 4
```

**Constraints:**
- `1 <= n <= 1000`
- `0 <= presses <= 1000`
