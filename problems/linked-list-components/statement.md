You are given the head of a singly linked list holding distinct values and an array `nums` containing a subset of those values. A component is a maximal run of consecutive list nodes whose values all appear in `nums`.

Walk the list from head to tail and count how many such blocks occur. For example, with list `[0,1,2,3]` and `nums = [0,1,3]`, the blocks are `[0,1]` and `[3]`, so the answer is 2.

**Constraints:**
- The list has between 1 and 10000 nodes.
- Values are distinct and in range `[0, 10000]`.
- `1 <= nums.length <= list length`.
- Every value of `nums` appears in the list.
