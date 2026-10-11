You are given the first node `head` of a singly linked list whose nodes each store an integer.

For every neighboring pair in the current chain, splice in a fresh node positioned between them whose stored value equals the greatest common divisor of the two neighbors' values.

Hand back the head of the chain once all insertions are complete.

Recall that the greatest common divisor of a pair is the biggest positive integer dividing both values without remainder.

**Examples:**

```
Input: head = [18,6,10,3]
Output: [18,6,6,2,10,1,3]
Explanation: The inserted values are gcd(18,6) = 6, gcd(6,10) = 2, and gcd(10,3) = 1, each placed between its pair.
```

```
Input: head = [7]
Output: [7]
```

**Constraints:**

- The number of nodes in the list is in the range `[1, 5000]`.
- `1 <= Node.val <= 1000`
