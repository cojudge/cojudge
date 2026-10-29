You are given a 0-indexed array of unique positive integers `nums`.

You can perform multiple operations on the array. In one operation you can choose two indices `i` and `j` (`i != j`) such that `gcd(nums[i], nums[j]) > 1` and traverse between them.

Return `true` if for every pair of indices `i` and `j` in `nums` there exists a sequence of operations that can take you from `i` to `j`, otherwise return `false`.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`
- All values are unique
