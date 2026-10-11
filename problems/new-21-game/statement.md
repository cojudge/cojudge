Alice plays a drawing game. She starts with 0 points and repeatedly draws a random whole number uniformly from `1` to `maxPts`, adding it to her score. She stops as soon as her score reaches at least `k`. Given `n`, return the probability that her final score is at most `n`.

**Portable adaptation:** CoJudge has no floating-point type, so return the probability as a decimal string that parses as a finite double (for example `"0.73278"` or `"1.0"`). Answers are accepted when they differ from the reference by at most `1e-5` in absolute value.

**Constraints:**
- `0 <= k <= n <= 10^4`
- `1 <= maxPts <= 10^4`
