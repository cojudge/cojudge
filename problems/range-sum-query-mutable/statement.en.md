You are given a changeable array `nums` plus a script of operations to replay in order.
Each operation is either `"sumRange"` with values `[left, right]`, asking for the sum of
`nums[left] + ... + nums[right]`, or `"update"` with values `[index, value]`, assigning
`nums[index] = value`. Return the answers of the `"sumRange"` operations in order.
(This is the function-style view of the classic mutable-array design task usually solved
with a segment tree or binary indexed tree.)

**Constraints:**
- `1 <= nums.length <= 3 * 10^4`
- `-100 <= nums[i], value <= 100`
- Indices in every operation are valid; at least one `"sumRange"` appears.
