Start from the positive integers 1, 2, 3, ... and delete every number whose decimal writing contains the digit 9. The survivors begin 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, ...

Given `n`, return the n-th survivor (counting from 1).

**Example 1:**
```
Input: n = 9
Output: 10
Explanation: The first eight survivors are 1..8, so the 9th is 10.
```

**Example 2:**
```
Input: n = 10
Output: 11
Explanation: 11 follows 10 in the survivor order.
```

**Example 3:**
```
Input: n = 1
Output: 1
Explanation: Counting starts at 1.
```

**Constraints:**
- `1 <= n <= 8 * 10^8`
