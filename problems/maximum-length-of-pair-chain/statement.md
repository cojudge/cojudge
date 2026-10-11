You are given `n` pairs `[a, b]` with `a < b`. A chain links pairs so that each pair's second entry is strictly smaller than the next pair's first entry (`b < c` for `[a,b]` followed by `[c,d]`). Pairs may be reordered freely and any subset may be used.

Implement `findLongestChain(pairs)` returning the longest achievable chain length.

**Constraints:**
- `1 <= pairs.length <= 2500`
- `pairs[i].length == 2`
- `-1000 <= pairs[i][j] <= 1000`
