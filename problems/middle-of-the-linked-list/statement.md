You are given the head of a singly linked list. Walk to the middle of the list and return that node: when the list has an odd number of nodes, return the exact center; when it has an even number, return the second of the two central nodes.

**Example 1:**
```
Input: head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: With five nodes the middle one holds 3, so the list from there on is [3,4,5].
```

**Example 2:**
```
Input: head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: With six nodes there are two centers (3 and 4); the second one holds 4, so the answer is [4,5,6].
```

**Constraints:**
- The list holds between `1` and `100` nodes.
- `1 <= Node.val <= 100`
