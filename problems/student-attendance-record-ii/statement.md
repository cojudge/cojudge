Consider all strings of length `n` built from the letters `P`, `L`, and `A`. A string is rewardable when it contains fewer than two `A` characters and never contains three consecutive `L` characters.

Given `n`, count how many rewardable strings exist. Because the total can be huge, return it modulo `10^9 + 7`.

**Example 1:**
```
Input: n = 2
Output: 8
Explanation: Out of 9 possible pairs only "AA" is disqualified.
```

**Example 2:**
```
Input: n = 1
Output: 3
Explanation: "P", "L" and "A" all qualify.
```

**Example 3:**
```
Input: n = 10101
Output: 183236316
Explanation: Large length taken modulo 1000000007.
```

**Constraints:**
- `1 <= n <= 10^5`
