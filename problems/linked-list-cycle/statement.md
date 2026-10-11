You receive `head`, the first node of a singly linked list. Decide whether following `next` links from that node can ever revisit a node: return true when such a loop exists, and false when the chain ends.

A loop means some node in the chain is reachable a second time by continuing along `next` pointers. For describing tests, `pos` records the index that the tail's `next` link points back to. Take note that `pos` is only a description of the test data and is not handed to your code.

**Constraints:**

- The number of the nodes in the list is in the range [0, 10^4].
- -10^5 ≤ Node.val ≤ 10^5
- pos is -1 or a valid index in the linked-list.
