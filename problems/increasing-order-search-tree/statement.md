Start from the root of a binary search tree. Gather its values from smallest to largest and rebuild them as a spine that leans only to the right: the tiniest value becomes the new root, each node keeps an empty left hand and points rightward to the next larger value.

Return the head of that right-leaning chain.

**Example 1:**
```
Input: root = [5,3,6,2,4,null,8,1,null,null,null,7,9]
Output: [1,null,2,null,3,null,4,null,5,null,6,null,7,null,8,null,9]
Explanation: The sorted order 1 through 9 is relinked so every left child is empty.
```

**Example 2:**
```
Input: root = [5,1,7]
Output: [1,null,5,null,7]
Explanation: In-order values [1,5,7] become a right-only chain.
```

**Example 3:**
```
Input: root = [1]
Output: [1]
Explanation: A lone node is already in the wanted form.
```

**Constraints:**
- `1 <= nodes in tree <= 100`
- `0 <= Node.val <= 1000`
