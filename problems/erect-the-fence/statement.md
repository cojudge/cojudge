A set of trees stands at integer coordinates. Imagine stretching a rope around the whole set so it touches the outermost trees; every tree that the rope touches or that lies exactly on a rope segment belongs to the fence.

Given `trees` as points, return the points on the fence boundary, including collinear points along the edges. The order does not matter.

**Constraints:**
- `1 <= trees.length <= 100`
- `-100 <= trees[i][j] <= 100`
- Points are distinct in the tests.

Adaptation: the nested input maps to int_array_2d and the nested output maps to int_list_2d in this judge.
