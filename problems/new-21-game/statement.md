Alice plays a drawing game. She starts with 0 points and repeatedly draws a random whole number uniformly from `1` to `maxPts`, adding it to her score. She stops as soon as her score reaches at least `k`. Given `n`, return the probability that her final score is at most `n`.

**Portable adaptation:** CoJudge has no floating-point type, so return the probability as a decimal string that parses as a finite double (for example `"0.73278"` or `"1.0"`). Answers are accepted when they differ from the reference by at most `1e-5` in absolute value.

**Example 1:**
```
Input: n = 10, k = 1, maxPts = 10
Output: "1.0"
Explanation: She stops after one draw, and every possible draw (1 through 10) is within the limit.
```

**Example 2:**
```
Input: n = 6, k = 1, maxPts = 10
Output: "0.6"
Explanation: The first draw decides everything; six of the ten faces (1-6) stay within the limit.
```

**Example 3:**
```
Input: n = 21, k = 17, maxPts = 10
Output: "0.73278"
Explanation: Drawing continues until at least 17, and the chance of landing on 21 or less rounds to 0.73278.
```

**Constraints:**
- `0 <= k <= n <= 10^4`
- `1 <= maxPts <= 10^4`
