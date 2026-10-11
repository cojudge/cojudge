Start from the root of a binary search tree. Gather its values from smallest to largest and rebuild them as a spine that leans only to the right: the tiniest value becomes the new root, each node keeps an empty left hand and points rightward to the next larger value.

Return the head of that right-leaning chain.

**Constraints:**
- `1 <= nodes in tree <= 100`
- `0 <= Node.val <= 1000`
