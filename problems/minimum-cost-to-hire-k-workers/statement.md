You are given two arrays, `quality` and `wage`, each with `n` entries describing `n` candidates. Candidate `i` produces `quality[i]` units of work and asks for at least `wage[i]` in pay. You must hire exactly `k` people.

All hired people are paid under one common rate `r` (pay per unit of quality), so person `i` receives `r * quality[i]`. The rate must be high enough that everyone hired gets at least what they asked for. Among all choices of `k` people and all feasible rates, minimize the total payroll.

Because the answer can be fractional, return it as a finite decimal string (for example `"105.0"`). A response is accepted when it matches the true minimum within a small tolerance.

Adaptation note: the original task expects a floating number; here you return the value encoded as a decimal string so every language uses the same `string` type.

**Example 1:**
```
Input: quality = [10,20,5], wage = [70,50,30], k = 2
Output: "105.0"
Explanation: Pick the workers with quality 5 and 10. The governing rate is 7, giving payments 35 and 70 for a total of 105.
```

**Example 2:**
```
Input: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
Output: "30.66667"
Explanation: The cheapest feasible trio costs about 30.67 within tolerance.
```

**Example 3:**
```
Input: quality = [5], wage = [10], k = 1
Output: "10.0"
```

**Constraints:**
- `1 <= k <= n <= 10^4`
- `1 <= quality[i], wage[i] <= 10^4`
