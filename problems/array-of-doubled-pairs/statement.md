Decide whether the array can be split into pairs where one entry doubles the other.

The array length is even. You must partition all entries into pairs `(a, b)` with `b = 2 * a`. Zeros pair with zeros, negatives follow the same doubling rule (for example `-2` pairs with `-4`), and every element is used exactly once.

Given `arr`, return `true` when such a pairing exists and `false` otherwise.

**Constraints:**
- `2 <= arr.length <= 3 * 10^4`
- Length is even.
- `-10^5 <= arr[i] <= 10^5`
