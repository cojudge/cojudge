You are given a positive integer `n`. Look at its binary representation without leading zeros.

Whenever the representation holds at least two `1` bits, measure the distance between every pair of neighboring `1` bits, where distance means the difference of their bit positions (equivalently, the number of steps between them). Return the largest such distance. If fewer than two `1` bits appear, return `0`.

**Example 1:**
```
Input: n = 22
Output: 2
Explanation: 22 in binary is 10110. Gaps between consecutive ones are 2 and 2, so the maximum is 2.
```

**Example 2:**
```
Input: n = 8
Output: 0
Explanation: 8 in binary is 1000 with a single one.
```

**Example 3:**
```
Input: n = 5
Output: 2
Explanation: 5 in binary is 101, with one gap of 2.
```

**Constraints:**
- `1 <= n <= 10^9`
