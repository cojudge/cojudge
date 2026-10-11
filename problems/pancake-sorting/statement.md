A pancake flip chooses a positive `k` and reverses the first `k` entries of the array. Starting from `arr` (a permutation of `1..n`), return any sequence of at most `10 * n` flips that leaves the whole array sorted in non-decreasing order. The judge replays your flips, so every valid sorting sequence is accepted — the reference answer is only one possibility.

**Constraints:**
- `1 <= arr.length <= 100`
- `arr` holds each integer from `1` to `arr.length` exactly once.
- The answer is an integer list with at most `10 * arr.length` entries, each between `1` and `arr.length`.
