You are given a circular array `nums` of length `n`. From index `i` you jump to index `(i + nums[i]) mod n`, wrapping around the ends: a positive value moves forward and a negative value moves backward.

A valid loop is a cycle of indices with length greater than 1 such that every jump in the cycle points the same way (all forward or all backward). A jump that lands back on its own index does not count, since that cycle has length 1.

Return `true` if such a loop exists, and `false` otherwise.

**Example 1:**
```
Input: nums = [2,-1,1,2,2]
Output: true
Explanation: Starting at index 0, the jumps visit 0 -> 2 -> 3 -> 0, a loop of length 3 where every jump is forward.
```

**Example 2:**
```
Input: nums = [-1,2]
Output: false
Explanation: The jump from index 0 goes backward while the jump from index 1 goes forward, so the directions mix and no valid loop exists.
```

**Example 3:**
```
Input: nums = [-2,1,-1,-2,-2]
Output: false
Explanation: Every walk either changes direction or collapses onto a single index.
```

**Constraints:**
- `1 <= n <= 5000`
- `-1000 <= nums[i] <= 1000`
- `nums[i] != 0`
