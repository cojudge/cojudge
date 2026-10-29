Take the head of a chain and walk along it flipping each consecutive block of
`k` nodes, then hand back the head of the reworked chain.

A trailing block shorter than `k` nodes is left exactly as it is. Links may
be rewired, but simply exchanging the values held by nodes is not allowed.

**Constraints:**

- The list contains between `1` and `5000` nodes.
- `0 <= node.val <= 1000`
- `1 <= k <=` the length of the list

**Follow-up:** Is there a way to accomplish this with only `O(1)` extra memory?
