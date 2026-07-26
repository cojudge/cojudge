There are `numCourses` courses labeled from `0` to `numCourses - 1`. Each pair
`prerequisites[i] = [course, prerequisite]` means that `prerequisite` must be
completed before `course`.

Return an ordering in which all courses can be completed. If more than one
ordering is valid, return any of them. If no ordering exists because the
prerequisite graph contains a cycle, return an empty array.

**Constraints:**

- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= numCourses * (numCourses - 1)`
- `prerequisites[i].length == 2`
- `0 <= course, prerequisite < numCourses`
- `course != prerequisite`
- All prerequisite pairs are unique.
