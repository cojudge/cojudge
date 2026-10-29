You are given an integer array `nums` and a list of `queries`, where each query is a pair `[val, index]` meaning add `val` to `nums[index]`.

After applying each query in order, compute the sum of all even-valued entries in the array. Collect these sums into an answer array of the same length as `queries` and return it.

**Constraints:**
- `1 <= nums.length <= 10000`
- `-10000 <= nums[i] <= 10000`
- `1 <= queries.length <= 10000`
- `queries[i] = [val, index]`, `-10000 <= val <= 10000`, `0 <= index < nums.length`.
