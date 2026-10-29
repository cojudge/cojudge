A pattern string `s` of length `n` uses only the letters `I` (rising) and `D` (falling). It sketches a permutation of the numbers `1..n+1`: for each slot `i`, `I` demands `perm[i] < perm[i+1]` while `D` demands `perm[i] > perm[i+1]`.

Many permutations can fit the same sketch. Build the smallest one in dictionary order.

**Constraints:**

- `1 <= s.length <= 10^5`
- Each `s[i]` is `I` or `D`.
