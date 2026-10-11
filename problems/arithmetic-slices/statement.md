Call an array arithmetic when it holds at least three numbers and every neighbouring gap is identical — for instance `[3,-1,-5,-9]` steps by `-4` each time.

Given `nums`, count how many of its contiguous subarrays (of length three or more) are arithmetic. Overlapping slices each count separately.

**Example 1:**
```
Input: nums = [1,2,3,4]
Output: 3
Explanation: [1,2,3], [2,3,4] and the whole [1,2,3,4] qualify.
```

**Example 2:**
```
Input: nums = [1]
Output: 0
```

**Example 3:**
```
Input: nums = [7,7,7,7]
Output: 3
Explanation: Two length-3 windows plus the full length-4 window share step 0.
```

**Constraints:**
- `1 <= nums.length <= 5000`
- `-1000 <= nums[i] <= 1000`
