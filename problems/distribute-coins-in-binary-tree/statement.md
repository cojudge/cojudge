Each node of a binary tree holds some number of coins, and the total number of coins equals the number of nodes. In one move you may shift a single coin from a node to one of its directly connected neighbors (parent or child).

Rearrange the coins so that every node ends with exactly one coin. Return the smallest possible number of moves.

**Example 1:**
```
Input: root = [3,0,0]
Output: 2
Explanation: The root keeps one coin and sends one to each child.
```

**Example 2:**
```
Input: root = [0,3,0]
Output: 3
Explanation: Three unit steps are needed to give every node one coin.
```

**Example 3:**
```
Input: root = [1,0,2]
Output: 2
Explanation: A coin travels from the right subtree to the left subtree through the root.
```

**Constraints:**
- `1 <= number of nodes <= 100`
- `0 <= node value <= number of nodes`
- The sum of all node values equals the number of nodes.
