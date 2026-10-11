You are given the head of a singly linked list holding distinct values and an array `nums` containing a subset of those values. A component is a maximal run of consecutive list nodes whose values all appear in `nums`.

Walk the list from head to tail and count how many such blocks occur. For example, with list `[0,1,2,3]` and `nums = [0,1,3]`, the blocks are `[0,1]` and `[3]`, so the answer is 2.

**Example 1:**
```
Input: head = [0,1,2,3], nums = [0,1,3]
Output: 2
Explanation: One block covers 0-1 and another covers 3; node 2 splits them.
```

**Example 2:**
```
Input: head = [0,1,2,3,4], nums = [0,3,1,4]
Output: 2
Explanation: Blocks 0-1 and 3-4 are each contiguous.
```

**Example 3:**
```
Input: head = [1,2,0,4], nums = [0]
Output: 1
Explanation: The lone matching node forms a single block.
```

**Constraints:**
- The list has between 1 and 10000 nodes.
- Values are distinct and in range `[0, 10000]`.
- `1 <= nums.length <= list length`.
- Every value of `nums` appears in the list.
