Reorder the array into wiggle order: `nums[0] <= nums[1] >= nums[2] <= nums[3] ...`.

**Adaptation:** the original requires an in-place void update; here implement
`wiggleSort(nums)` returning a reordered copy. Any ordering with the wiggle
property and the same multiset of values is accepted.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^4`
