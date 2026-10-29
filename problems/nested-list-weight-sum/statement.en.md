You are given a nested structure written as text in `nestedList`, for example `"[[1,1],2,[1,1]]"`. Square brackets delimit lists, integers (possibly negative) are bare numbers, and commas separate elements. Nesting may be arbitrarily deep.

The weight of each integer equals its depth: integers directly inside the outermost list sit at depth 1, integers one level deeper sit at depth 2, and so on. Compute the total of `integer * depth` over every integer in the structure.

**Constraints:**
- `1 <= nestedList.length <= 500`
- Integers lie in `[-100, 100]`.
- The text is always a valid nested list.

**Adaptation note:** The original signature takes a list of `NestedInteger` objects. Here the same structure arrives serialized as a `string` (e.g. `"[[1,1],2,[1,1]]"`) and you return the integer total.
