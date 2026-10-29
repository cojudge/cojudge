Given a triangular array `triangle` where `triangle[i]` holds `i + 1` numbers, start at the top element and move down one step at a time.

From position `i` in the current row you may step to position `i` or position `i + 1` in the row below. Each visited cell contributes its value to the total.

Return the smallest possible total from the top to any bottom-row cell.

**Constraints:**
- `1 <= triangle.length <= 200`
- `triangle[0].length == 1`
- `triangle[i].length == triangle[i-1].length + 1`
- `-10^4 <= triangle[i][j] <= 10^4`

**Adaptation note:** The original LeetCode signature uses `List<List<Integer>>`. Here the input is `int[][]` (`int_array_2d`) with identical layout.
