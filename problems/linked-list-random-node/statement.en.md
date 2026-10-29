Return any value stored in a linked list, standing in for a uniform random pick.

You receive the head of a singly linked list with at least one node. Implement `getRandomNode(head)`, which returns the value of one node from the chain. The classic task additionally requires every node to be equally likely (usually via reservoir sampling) across repeated calls; this portable version calls the function once per test and accepts any value present in the list, so sampling fairness is not verified. Just make sure the returned integer actually occurs in the input chain.

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `-10^4 <= Node.val <= 10^4`
