This is an offline adaptation of a design task. Instead of writing a class, you write one function that replays a whole session:

```
runBstIterator(root, operations)
```

`root` is the binary search tree to walk (level-order form such as `[7,3,15,null,null,9,20]`), and `operations` holds only `"next"` or `"hasNext"`, in the order they are called. The iterator visits values in ascending order:

- `"next"` returns the next smallest value and moves forward.
- `"hasNext"` returns `1` when values remain and `0` otherwise.

Return the answers for every operation in order, encoding `"hasNext"` as `1` or `0`.

**Example 1:**
```
Input: root = [7,3,15,null,null,9,20], operations = ["next","next","hasNext","next","hasNext","next","hasNext"]
Output: [3,7,1,9,1,15,1]
Explanation: Ascending order is [3,7,9,15,20]. The first two next calls give 3 and 7; values remain so hasNext is 1; next gives 9; values remain so 1; next gives 15; one value (20) remains so 1.
```

**Example 2:**
```
Input: root = [1], operations = ["hasNext","next","hasNext"]
Output: [1,1,0]
Explanation: One value remains (1), next returns 1, then nothing remains (0).
```

**Example 3:**
```
Input: root = [], operations = ["hasNext"]
Output: [0]
Explanation: An empty tree has no next value.
```

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^5 <= Node.val <= 10^5`
- `"next"` is only called when `"hasNext"` would be true.
