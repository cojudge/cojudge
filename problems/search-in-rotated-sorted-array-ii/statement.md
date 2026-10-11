Start from an integer list `nums` arranged in nondecreasing order; repeats are allowed.

Ahead of your call, the list is turned at some hidden cut point `k` (`0 <= k < nums.length`), yielding `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed). As an illustration, `[0,1,2,4,4,4,5,6,6,7]` cut at position `5` turns into `[4,5,6,6,7,0,1,2,4,4]`.

Taking the turned list `nums` plus an integer `target`, state whether `target` shows up: answer `true` when it does and `false` otherwise.

Try to hold the total number of operations down as far as you can.

**Example 1:**
```
Input: nums = [2,5,6,0,0,1,2], target = 0
Output: true
```

**Example 2:**
```
Input: nums = [2,5,6,0,0,1,2], target = 3
Output: false
```

**Constraints:**
- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is guaranteed to be rotated at some pivot
- `-10^4 <= target <= 10^4`
