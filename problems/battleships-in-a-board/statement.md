A board holds battleships marked `X` and empty water marked `.`. Each ship occupies a straight line of one or more cells, either fully horizontal or fully vertical. Different ships never touch side by side — at least one water cell separates them horizontally and vertically (diagonal touching is allowed).

Count how many distinct ships appear. Scan once using only constant extra memory.

**Example 1:**
```
Input: board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]
Output: 2
Explanation: The lone X at the top left is one ship; the three X cells in the last column form a second vertical ship.
```

**Example 2:**
```
Input: board = [["."]]
Output: 0
```

**Example 3:**
```
Input: board = [["X"]]
Output: 1
```

**Constraints:**
- `1 <= board.length, board[i].length <= 200`
- Each cell is either `X` or `.`.

**Type note:** the board arrives as a 2D char array; in Rust it is passed as one string holding the JSON-encoded board.
