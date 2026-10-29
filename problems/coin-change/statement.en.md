An integer array `coins` enumerates available token face values, while an integer `amount` states a monetary total to assemble.
Select a multiset drawn from `coins` (reuse permitted) whose sum equals `amount`, employing as few tokens as possible.
When no multiset reaches `amount`, report `-1`.

**Constraints:**

- 1 ≤ coins.length ≤ 12
- 1 ≤ coins[i] ≤ 2^31 - 1
- 0 ≤ amount ≤ 10^4
