A set of trees stands at integer coordinates. Imagine stretching a rope around the whole set so it touches the outermost trees; every tree that the rope touches or that lies exactly on a rope segment belongs to the fence.

Given `trees` as points, return the points on the fence boundary, including collinear points along the edges. The order does not matter.

**Example 1:**
```
Input: trees = [[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]
Output: [[1,1],[2,0],[4,2],[3,3],[2,4]]
Explanation: These five points wrap all trees; interior points stay inside.
```

**Example 2:**
```
Input: trees = [[1,2],[2,2],[4,2]]
Output: [[1,2],[2,2],[4,2]]
Explanation: All three lie on one line, so all belong to the boundary.
```

**Example 3:**
```
Input: trees = [[0,0],[1,0],[2,0]]
Output: [[0,0],[1,0],[2,0]]
```

**Constraints:**
- `1 <= trees.length <= 100`
- `-100 <= trees[i][j] <= 100`
- Points are distinct in the tests.

Adaptation: the nested input maps to int_array_2d and the nested output maps to int_list_2d in this judge.
