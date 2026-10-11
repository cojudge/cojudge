You are given a changeable array `nums` plus a script of operations to replay in order.
Each operation is either `"sumRange"` with values `[left, right]`, asking for the sum of
`nums[left] + ... + nums[right]`, or `"update"` with values `[index, value]`, assigning
`nums[index] = value`. Return the answers of the `"sumRange"` operations in order.
(This is the function-style view of the classic mutable-array design task usually solved
with a segment tree or binary indexed tree.)

**Example 1:**
```
Input: nums = [1,3,5], operations = ["sumRange","update","sumRange"], values = [[0,2],[1,2],[0,2]]
Output: [9,8]
Explanation: The first range sums to 6 before... precisely 1+3+5 = 9; after setting index 1
to 2 the same range sums to 1+2+5 = 8.
```

**Example 2:**
```
Input: nums = [7], operations = ["sumRange","update","sumRange"], values = [[0,0],[0,4],[0,0]]
Output: [7,4]
Explanation: One cell, read, rewritten, and read again.
```

**Example 3:**
```
Input: nums = [0,0], operations = ["update","update","sumRange"], values = [[0,5],[1,3],[0,1]]
Output: [8]
Explanation: Both cells are set before the single range query.
```

**Constraints:**
- `1 <= nums.length <= 3 * 10^4`
- `-100 <= nums[i], value <= 100`
- Indices in every operation are valid; at least one `"sumRange"` appears.
