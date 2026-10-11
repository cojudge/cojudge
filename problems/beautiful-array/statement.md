A permutation of `1..n` is called beautiful when no three indices `i < j < k` form an arithmetic progression in values, meaning `2 * arr[j] != arr[i] + arr[k]` for every triple.

Given `n`, return any beautiful permutation. The checker verifies the permutation property and the progression rule rather than matching one exact order.

**Constraints:**
- `1 <= n <= 1000`

Adaptation: the output uses `int_array`; any valid beautiful array is accepted.
