You are given a circular array `nums` of length `n`. From index `i` you jump to index `(i + nums[i]) mod n`, wrapping around the ends: a positive value moves forward and a negative value moves backward.

A valid loop is a cycle of indices with length greater than 1 such that every jump in the cycle points the same way (all forward or all backward). A jump that lands back on its own index does not count, since that cycle has length 1.

Return `true` if such a loop exists, and `false` otherwise.

**Constraints:**
- `1 <= n <= 5000`
- `-1000 <= nums[i] <= 1000`
- `nums[i] != 0`
