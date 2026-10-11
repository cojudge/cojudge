You are given the root of a binary search tree. Rearrange its nodes into ascending order linked through the `right` pointer, so that following `right` from the smallest node visits every value exactly once from low to high.

Return the head (the smallest node) of that chain. All `left` pointers in the returned structure must be `null` so the result remains a valid tree serialization.

**Example 1:**
```
Input: root = [4,2,5,1,3]
Output: [1,null,2,null,3,null,4,null,5]
Explanation: Inorder yields 1,2,3,4,5; chaining them via right pointers gives the right-leaning list above.
```

**Example 2:**
```
Input: root = [2,1,3]
Output: [1,null,2,null,3]
Explanation: The sorted order is 1,2,3.
```

**Example 3:**
```
Input: root = []
Output: []
Explanation: An empty tree flattens to nothing.
```

**Constraints:**
- The tree holds between 0 and 1000 nodes.
- Node values fit in a 32-bit signed integer.
- The input is a valid binary search tree.

Adaptation: the source produces a circular doubly linked list using left as previous and right as next. Because circular and backward links cannot be serialized as a tree without looping forever, this judge asks for the linear right-only chain (left pointers cleared, circular link omitted); only the ascending right order is checked.
