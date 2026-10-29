For a given digit count `n`, look at all products of two `n`-digit numbers (from `10^(n-1)` up to `10^n - 1`, with `1..9` for `n = 1`). Among those products, pick the greatest one whose decimal writing reads the same forward and backward.

Because that palindrome can be enormous, return it modulo `1337`.

**Constraints:**

- `1 <= n <= 8`
