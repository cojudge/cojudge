Given an integer array `nums`, consider all strictly increasing subsequences (not necessarily contiguous).

Return how many distinct subsequences attain the maximum possible length. Two subsequences count separately when their index sets differ, even if the values look alike.

**Example 1:**
```
Input: nums = [1,3,5,4,7]
Output: 2
Explanation: The longest length is 4, achieved by [1,3,4,7] and [1,3,5,7].
```

**Example 2:**
```
Input: nums = [2,2,2,2,2]
Output: 5
Explanation: The longest length is 1; each single position forms one run.
```

**Example 3:**
```
Input: nums = [1,2,3]
Output: 1
```

**Constraints:**
- `1 <= nums.length <= 2000`
- `-1000 <= nums[i] <= 1000`
