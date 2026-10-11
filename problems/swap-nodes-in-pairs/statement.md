You are given the head of a singly linked list. Exchange every pair of neighboring nodes (positions 1-2, 3-4, and so on) and return the head of the rearranged list.

When the list holds an odd number of nodes, the final node has no partner and stays where it is. You must relink the existing nodes themselves; just overwriting their values is not allowed.

**Example 1:**
```
Input: head = [1,2,3,4]
Output: [2,1,4,3]
Explanation: Nodes 1 and 2 trade places, and nodes 3 and 4 trade places.
```

**Example 2:**
```
Input: head = []
Output: []
Explanation: An empty list has nothing to swap.
```

**Example 3:**
```
Input: head = [1]
Output: [1]
Explanation: A single node has no partner, so the list is unchanged.
```

**Constraints:**
- The number of nodes in the list is in the range `[0, 100]`.
- `0 <= Node.val <= 100`
