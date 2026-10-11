You are handed an array `nums` of length `n` where each entry satisfies `0 <= nums[i] < n`. Rotating left by `k` produces a new arrangement `rot` with `rot[i] = nums[(i + k) % n]`. The score of that rotation counts indices with `rot[i] <= i`.

Return the smallest rotation index `k` that achieves the highest possible score. If several rotations tie, pick the least `k`.

**Example 1:**
```
Input: nums = [2,3,1,4,0]
Output: 3
Explanation: Rotation 3 yields [4,0,2,3,1] with four scoring positions, the best achievable.
```

**Example 2:**
```
Input: nums = [1,3,0,2,4]
Output: 0
Explanation: Rotation 0 already reaches the top score of three.
```

**Example 3:**
```
Input: nums = [0]
Output: 0
Explanation: A single-element array has only one rotation.
```

**Constraints:**
- `1 <= nums.length <= 2000`
- `0 <= nums[i] < nums.length`
