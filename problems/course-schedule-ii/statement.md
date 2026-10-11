There are `numCourses` subjects numbered `0` through `numCourses - 1`. Every entry `prerequisites[i] = [course, prerequisite]` states that `course` may only be taken after `prerequisite` has been finished.

Produce any sequence in which every subject can be finished while respecting those requirements. When several valid sequences exist, any one of them is accepted. When the requirements loop back on themselves so that no complete sequence is possible, return an empty array.

**Constraints:**
- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= numCourses * (numCourses - 1)`
- `prerequisites[i].length == 2`
- `0 <= course, prerequisite < numCourses`
- `course != prerequisite`
- All prerequisite pairs are unique.
