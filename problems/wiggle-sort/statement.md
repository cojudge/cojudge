Reorder the array into wiggle order: `nums[0] <= nums[1] >= nums[2] <= nums[3] ...`.

**Adaptation:** the original requires an in-place void update; here implement
`wiggleSort(nums)` returning a reordered copy. Any ordering with the wiggle
property and the same multiset of values is accepted.

**Examples:**
```
Input: nums = [3,5,2,1,6,4]
Output: [3,5,1,6,2,4]
```
```
Input: nums = [6,6,5,6,3,8]
Output: [6,6,3,6,5,8]
```
```
Input: nums = [1]
Output: [1]
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^4`
