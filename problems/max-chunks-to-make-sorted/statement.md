You are given an array `arr` of length `n` holding each integer from `0` to `n - 1` exactly once (a permutation).

Split it into the most contiguous chunks possible so that sorting every chunk on its own and concatenating the results equals the fully sorted array `[0, 1, ..., n-1]`. Return that largest number of chunks.

**Constraints:**
- `n == arr.length`
- `1 <= n <= 10`
- `0 <= arr[i] < n`
- All values are distinct
