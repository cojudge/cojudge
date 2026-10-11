You are given two arrays, `quality` and `wage`, each with `n` entries describing `n` candidates. Candidate `i` produces `quality[i]` units of work and asks for at least `wage[i]` in pay. You must hire exactly `k` people.

All hired people are paid under one common rate `r` (pay per unit of quality), so person `i` receives `r * quality[i]`. The rate must be high enough that everyone hired gets at least what they asked for. Among all choices of `k` people and all feasible rates, minimize the total payroll.

Because the answer can be fractional, return it as a finite decimal string (for example `"105.0"`). A response is accepted when it matches the true minimum within a small tolerance.

Adaptation note: the original task expects a floating number; here you return the value encoded as a decimal string so every language uses the same `string` type.

**Constraints:**
- `1 <= k <= n <= 10^4`
- `1 <= quality[i], wage[i] <= 10^4`
