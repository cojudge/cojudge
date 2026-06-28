# Adding a Problem to CoJudge

This guide explains how to add a new problem to CoJudge, with examples for both standard function-based problems and class-based design problems.

## Overview

Each problem lives in its own folder under `problems/<slug>/` with the following files:

```
problems/<slug>/
├── statement.md        # Problem description (Markdown)
├── metadata.json       # Metadata, starter code, sample tests, hints
├── official-tests.json # Comprehensive test cases for submission
├── Marker.java         # Reference solution + validation logic
└── solution.md         # Optional — Approach, complexity, and Python solution
```

Only `statement.md`, `metadata.json`, `official-tests.json`, and `Marker.java` are required. `solution.md` is optional — if present, a "Reference Solution" button appears in the UI.

After creating the problem files, register it in `courses/blind75/courseinfo.json`.

---

## 1. `statement.md`

Write the problem description in Markdown. Include examples and constraints.

```markdown
Given an array of integers `nums` and an integer `target`, return indices of the two numbers
such that they add up to `target`. If no such pair exists, return an empty array.

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Constraints:**
- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
```

---

## 2. `metadata.json`

### Required Fields

| Field | Description |
|---|---|
| `id` | Slug matching the folder name |
| `title` | Display title (e.g. `"1. Two Sum"`) |
| `difficulty` | `"Easy"`, `"Medium"`, or `"Hard"` |
| `link` | LeetCode problem URL |
| `category` | Category slug (e.g. `"array"`, `"tree"`, `"heap"`) |
| `examples` | Array of `{input, output, explanation?}` for the UI |
| `starterCode` | Object mapping language keys to starter code strings |
| `testCases` | Array of sample test cases (used by `cojudge run`) |
| `functionName` | The method name the user implements |
| `params` | Array of `{name, type}` descriptors |
| `outputType` | The return type of the function |
| `hints` | Array of hint strings for the UI |

### Supported Parameter / Output Types

| Type | Description | Example Value |
|---|---|---|
| `int` | Integer | `42` |
| `string` | String | `"hello"` |
| `boolean` | Boolean | `true` |
| `int_array` | 1D integer array | `"[1,2,3]"` |
| `int_array_2d` | 2D integer array | `"[[1,2],[3,4]]"` |
| `string_array` | String array | `"[\"a\",\"b\"]"` |
| `string_list` | List of strings (output only) | `["null","1.0"]` |
| `string_list_2d` | 2D list of strings | `[["a","b"],["c"]]` |
| `int_list` | List of integers | `[1,2,3]` |
| `int_list_2d` | 2D list of integers | `[[1,2],[3,4]]` |
| `list_node` | Linked list node | `"[1,2,3]"` |
| `list_node_array` | Array of linked lists | `"[[1,2],[3,4]]"` |
| `tree_node` | Binary tree (BFS serialization) | `"[4,2,7,1,3,6,9]"` |
| `char_array_2d` | 2D char array | `"[[\"a\",\"b\"],[\"c\"]]"` |

### Starter Code Per Language

Include starter code for each supported language. The class/method names follow each language's conventions:

```json
{
  "starterCode": {
    "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
    "python": "from typing import List\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
    "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};",
    "csharp": "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}",
    "rust": "pub struct Solution;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        \n    }\n}"
  }
}
```

**Naming conventions by language:**

| Language | Class Name | Method Name | Conventions |
|---|---|---|---|
| Java | `Solution` | `camelCase` | Standard Java |
| Python | `Solution` | `snake_case` | PEP 8 |
| C++ | `Solution` | `camelCase` | Common C++ style |
| C# | `Solution` | `PascalCase` | .NET conventions |
| Rust | `Solution` (struct) | `snake_case` | Rust conventions |

### Test Cases

`testCases` in `metadata.json` are the sample tests shown to the user and used by `cojudge run`. Each test case object has keys matching `params` names:

```json
{
  "testCases": [
    { "nums": "[2,7,11,15]", "target": 9 },
    { "nums": "[3,2,4]", "target": 6 }
  ]
}
```

Array values are stored as **JSON strings**. For example, `int_array` value `[2,7,11,15]` is written as `"[2,7,11,15]"`.

### Complete Example (Standard Function-Based Problem)

```json
{
  "id": "two-sum",
  "title": "1. Two Sum",
  "difficulty": "Easy",
  "link": "https://leetcode.com/problems/two-sum/",
  "category": "array",
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  "starterCode": {
    "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
    "python": "from typing import List\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
    "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};",
    "csharp": "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}",
    "rust": "pub struct Solution;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        \n    }\n}"
  },
  "testCases": [
    { "nums": "[2,7,11,15]", "target": 9 },
    { "nums": "[3,2,4]", "target": 6 },
    { "nums": "[3,3]", "target": 6 }
  ],
  "functionName": "twoSum",
  "params": [
    { "name": "nums", "type": "int_array" },
    { "name": "target", "type": "int" }
  ],
  "outputType": "int_array",
  "hints": [
    "Use HashMap. The key will be `nums[i]` while the value will be `i`."
  ]
}
```

---

## 3. `official-tests.json`

An array of test case objects with the same shape as `testCases` in `metadata.json`, but more comprehensive. The system runs these when the user clicks **Submit**.

**No need to write expected outputs.** The judge automatically computes them from `Marker.java`.

```json
[
  { "nums": "[2,7,11,15]", "target": 9 },
  { "nums": "[3,2,4]", "target": 6 },
  { "nums": "[1,2,3,4,5]", "target": 9 },
  { "nums": "[-1,-2,-3,-4,-5]", "target": -8 },
  { "nums": "[2147483647, -2147483648, 1]", "target": -1 }
]
```

### Large Test Cases

For large inputs that would slow down batching, mark them with `_isLargeTest`:

```json
{
  "nums": "@javascript:JSON.stringify([...Array(500000).fill(1), 2, 2])",
  "target": 4,
  "_isLargeTest": true
}
```

The `@javascript:` prefix lets you generate data dynamically. Large tests are executed alone rather than batched.

---

## 4. `Marker.java`

The marker class is always written in **Java** and must contain two methods:

### 4.1 Reference Solution

A method matching the `functionName` signature from `metadata.json`. This is the correct solution.

```java
import java.util.*;
class Marker {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int want = target - nums[i];
            if (map.containsKey(want))
                return new int[]{map.get(want), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

### 4.2 Validation Method

A method `isCorrect` that receives the same input parameters plus the user's output, and returns `boolean`.

The output parameter type matches `outputType` from `metadata.json`:
- `int_array` → `int[]`
- `string_list` → `List<String>`
- `tree_node` → `TreeNode`
- `boolean` → `boolean`

```java
public boolean isCorrect(int[] nums, int target, int[] output) {
    if (output.length == 0) return twoSum(nums, target).length == 0;
    return nums[output[0]] + nums[output[1]] == target;
}
```

### Example with Tree Nodes

```java
class Marker {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        root.left = invertTree(root.right);
        root.right = left;
        return root;
    }
    
    public boolean isCorrect(TreeNode root, TreeNode output) {
        return equalTrees(output, invertTree(root));
    }
    
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
}
```

---

## 5. `solution.md` (Optional)

A Markdown file with a walkthrough of the solution approach. When present, the UI shows a "Reference Solution" button on the problem page. It should follow this format:

````markdown
## Approach

[2-4 sentences explaining the algorithm]

## Complexity Analysis

- **Time Complexity:** O(?)
- **Space Complexity:** O(?)

## Implementation

```python
from typing import List
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        ...
```
````

The implementation should be **Python** and must pass all official tests (`cojudge submit`).

---

## 6. Class-Based Problems (Design Problems)

For problems like **295. Find Median from Data Stream** where the user implements a class with multiple methods (not a single function), add a `classProblem` field to `metadata.json`:

```json
{
  "classProblem": {
    "userClassName": "MedianFinder"
  },
  "functionName": "solve",
  "params": [
    { "name": "operations", "type": "string_array" },
    { "name": "values", "type": "int_array_2d" }
  ],
  "outputType": "string_list"
}
```

### How It Works

Test cases are encoded as parallel arrays of operations and their values:

```
Operations: ["MedianFinder", "addNum", "findMedian", "addNum", "findMedian"]
Values:     [[],          [1],      [],          [2],      []]
Output:     [null,        null,     1.0,         null,     1.5]
```

The user writes their class (e.g. `MedianFinder`) directly. The runner auto-generates a `Solution` wrapper that dispatches operations to the user's class. **The user never writes a `solve` function.**

### Starter Code for Class Problems

```json
{
  "starterCode": {
    "java": "class MedianFinder {\n    public MedianFinder() {\n        \n    }\n    public void addNum(int num) {\n        \n    }\n    public double findMedian() {\n        return 0.0;\n    }\n}",
    "python": "class MedianFinder:\n    def __init__(self):\n        \n    def addNum(self, num: int) -> None:\n        \n    def findMedian(self) -> float:\n        return 0.0",
    "cpp": "class MedianFinder {\npublic:\n    MedianFinder() {}\n    void addNum(int num) {}\n    double findMedian() { return 0.0; }\n};",
    "csharp": "public class MedianFinder {\n    public MedianFinder() {}\n    public void AddNum(int num) {}\n    public double FindMedian() { return 0.0; }\n}",
    "rust": "pub struct MedianFinder {}\n\nimpl MedianFinder {\n    pub fn new() -> Self { MedianFinder {} }\n    pub fn add_num(&mut self, num: i32) {}\n    pub fn find_median(&self) -> f64 { 0.0 }\n}"
  }
}
```

**Method naming conventions for class problems:**

| Language | Constructor | Methods |
|---|---|---|
| Java | `MedianFinder()` | `addNum`, `findMedian` |
| Python | `__init__` | `addNum`, `findMedian` |
| C++ | `MedianFinder()` | `addNum`, `findMedian` |
| C# | `MedianFinder()` | `AddNum`, `FindMedian` |
| Rust | `new()` | `add_num`, `find_median` |

### Marker.java for Class Problems

The `Marker.java` must include the `solve` function that dispatches operations to the reference implementation:

```java
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        MedianFinder mf = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MedianFinder")) {
                mf = new MedianFinder();
                result.add("null");
            } else if (op.equals("addNum")) {
                mf.addNum(values[i][0]);
                result.add("null");
            } else if (op.equals("findMedian")) {
                double med = mf.findMedian();
                if (med == (long) med)
                    result.add(String.valueOf((long) med) + ".0");
                else
                    result.add(String.valueOf(med));
            }
        }
        return result;
    }
    
    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        return solve(operations, values).equals(output);
    }
    
    class MedianFinder {
        // reference implementation using two heaps
    }
}
```

---

## 7. Registering in a Course

Add the problem slug to `courses/blind75/courseinfo.json` under the appropriate category:

```json
{
  "problems-of-category": {
    "heap": ["find-median-from-data-stream", "top-k-frequent-elements"]
  }
}
```

You can also add problems to categories that don't exist yet:

```json
{
  "category-order": ["array", "binary", "dp", "graph", "interval", "linked-list", "matrix", "string", "tree", "heap", "new-category"],
  "problems-of-category": {
    "new-category": ["your-new-problem"]
  }
}
```

---

## 8. Verification

### 7.1 Initialize starter code

```bash
cojudge init <slug> --lang java --output /tmp/solution.java
```

Verify the generated starter code looks correct for each language.

### 7.2 Run sample tests with a correct solution

Create a correct implementation and test it:

```bash
cojudge run <slug> /tmp/solution.java      # Java
cojudge run <slug> /tmp/solution.py        # Python
cojudge run <slug> /tmp/solution.cpp       # C++
cojudge run <slug> /tmp/solution.cs        # C#
cojudge run <slug> /tmp/solution.rs        # Rust
```

All sample tests should pass.

### 7.3 Test with wrong solutions to verify `isCorrect`

Create an intentionally wrong solution to ensure the judge correctly rejects it.

### 7.4 Run submission tests (optional)

```bash
cojudge submit <slug> /tmp/solution.java
```

### 7.5 Test the web UI

1. Start the server: `cojudge`
2. Open the browser and navigate to the problem
3. Load a solution file and click "Run" and "Submit"

### Verification Checklist

- [ ] `cojudge init` produces correct starter code for all 5 languages
- [ ] `cojudge run` passes for a correct solution in all 5 languages
- [ ] `cojudge run` fails for an incorrect solution
- [ ] `cojudge submit` passes (official tests)
- [ ] Problem appears in the web UI under the correct category
- [ ] Examples display correctly in the problem statement

---

## Reference: Existing Problems

| Problem | Type | Key Features |
|---|---|---|
| `two-sum` | Standard | Basic `int_array` params/output |
| `invert-binary-tree` | Standard | `tree_node` param/output |
| `reverse-linked-list` | Standard | `list_node` param/output |
| `valid-parentheses` | Standard | `string` param, `boolean` output |
| `merge-intervals` | Standard | `int_array_2d` param/output |
| `group-anagrams` | Standard | `string_array` param, `string_list_2d` output |
| `find-median-from-data-stream` | Class-based | `classProblem` with `string_array`/`int_array_2d` params |
