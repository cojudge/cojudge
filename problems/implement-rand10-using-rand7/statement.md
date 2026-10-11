In the original form of this task you are given a uniform generator `rand7()` producing integers 1 through 7, and you must build a uniform `rand10()` producing integers 1 through 10 from it.

**Offline adaptation used here:** implement `runRand10(calls)`, which returns an array of length `calls` where each entry is an integer from 1 to 10. Inside your solution you may write your own `rand7` helper (a uniform 1..7 source) and derive each draw with rejection sampling: combine two `rand7` results into a uniform value `r` in 1..49 via `r = (rand7() - 1) * 7 + rand7()`, keep it when `r <= 40` as `(r - 1) % 10 + 1`, and retry otherwise. The reference judge simulates `rand7` with a fixed seed internally.

Grading only checks that the returned array has exactly `calls` entries and that every entry lies in 1..10 (distribution uniformity is not measured).

**Constraints:**
- `1 <= calls <= 1000`
