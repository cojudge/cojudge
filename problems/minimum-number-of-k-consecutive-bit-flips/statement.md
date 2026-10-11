You are given a binary array `nums` and an integer `k`. In one move you may pick
any `k` consecutive elements and flip every bit in that window (`0` becomes
`1` and `1` becomes `0`).

Return the smallest number of moves that turns every element into `1`. If it
is impossible, return `-1`.

**Example 1:**
```
Input: nums = [0,1,0], k = 1
Output: 2
Explanation: Flip index 0, then flip index 2.
```

**Example 2:**
```
Input: nums = [1,1,0], k = 2
Output: -1
Explanation: No sequence of length-2 flips can fix the last zero.
```

**Example 3:**
```
Input: nums = [0,0,0,1,0,1,1,0], k = 3
Output: 3
Explanation: Flip starting at 0, then at 4, then at 5.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `nums[i]` is `0` or `1`.
- `1 <= k <= nums.length`
