You receive an integer list `nums` and an integer `k`. Cut `nums` into `k` neighbouring blocks that are all non-empty, aiming to push the biggest block total down as far as possible.

Hand back that smallest achievable biggest-block total.

A block here means a run of neighbours from the list with no gaps.

**Example 1:**
```
Input: nums = [7,2,5,10,8], k = 2
Output: 18
Explanation: Four ways exist to cut into two blocks. The best is [7,2,5] and [10,8] with biggest total 18.
```

**Example 2:**
```
Input: nums = [1,2,3,4,5], k = 2
Output: 9
Explanation: The best is [1,2,3] and [4,5] with biggest total 9.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= min(50, nums.length)`
