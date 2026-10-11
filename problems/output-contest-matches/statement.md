A knockout tournament starts with `n` ranked squads numbered `1` through `n`, where `1` is strongest and `n` is weakest. The count `n` is always a power of two.

In every round, the remaining entries are paired strongest-with-weakest: the first remaining entry meets the last, the second meets the second-last, and so on. Each pair is written as `(a,b)`. Winners advance, keeping their bracket text, and the process repeats until one bracket remains.

Build and return the final bracket string directly from `n` (this task is a plain function of `n`, not a class-design simulation).

**Constraints:**
- `n` is a power of two, `n == 2^k`
- `1 <= k <= 12` (so `2 <= n <= 4096`)
