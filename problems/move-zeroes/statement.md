Move all zeros to the end while keeping the relative order of non-zero values.

**Adaptation:** the original requires an in-place void update; here implement
`moveZeroes(nums)` returning the rearranged array.

**Examples:**
```
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
```
```
Input: nums = [0]
Output: [0]
```
```
Input: nums = [1,0,1]
Output: [1,1,0]
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
