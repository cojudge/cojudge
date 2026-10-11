You are given a nested structure written as text in `nestedList`, for example `"[[1,1],2,[1,1]]"`. Square brackets delimit lists, integers (possibly negative) are bare numbers, and commas separate elements. Nesting may be arbitrarily deep.

The weight of each integer equals its depth: integers directly inside the outermost list sit at depth 1, integers one level deeper sit at depth 2, and so on. Compute the total of `integer * depth` over every integer in the structure.

**Example 1:**
```
Input: nestedList = "[[1,1],2,[1,1]]"
Output: 10
Explanation: The four 1s sit at depth 2 (4 * 2 = 8) and the 2 sits at depth 1, giving 8 + 2 = 10.
```

**Example 2:**
```
Input: nestedList = "[1,[4,[6]]]"
Output: 27
Explanation: Depths give 1*1 + 4*2 + 6*3 = 1 + 8 + 18 = 27.
```

**Example 3:**
```
Input: nestedList = "[0]"
Output: 0
Explanation: A single zero at depth 1 contributes 0.
```

**Constraints:**
- `1 <= nestedList.length <= 500`
- Integers lie in `[-100, 100]`.
- The text is always a valid nested list.

**Adaptation note:** The original signature takes a list of `NestedInteger` objects. Here the same structure arrives serialized as a `string` (e.g. `"[[1,1],2,[1,1]]"`) and you return the integer total.
