You are given the first node `head` of a singly linked list whose nodes each store an integer.

For every neighboring pair in the current chain, splice in a fresh node positioned between them whose stored value equals the greatest common divisor of the two neighbors' values.

Hand back the head of the chain once all insertions are complete.

Recall that the greatest common divisor of a pair is the biggest positive integer dividing both values without remainder.

**Constraints:**

- The number of nodes in the list is in the range `[1, 5000]`.
- `1 <= Node.val <= 1000`
