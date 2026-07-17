import type { Param } from "./util";
import { extractOperations } from "./util";

export const rustImage = "rust:1.78-slim";

export const rustListNodeClass = `
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

impl ListNode {
  #[inline]
  pub fn new(val: i32) -> Self {
    ListNode {
      next: None,
      val
    }
  }
}

impl Drop for ListNode {
    fn drop(&mut self) {
        let self_ptr = self as *const ListNode as usize;
        let mut curr = self.next.take();
        let mut visited: std::collections::HashSet<usize> = std::collections::HashSet::new();
        visited.insert(self_ptr);
        while let Some(mut node) = curr {
            let ptr = node.as_ref() as *const ListNode as usize;
            if visited.contains(&ptr) {
                std::mem::forget(node);
                break;
            }
            visited.insert(ptr);
            curr = node.next.take();
        }
    }
}
`;

export const rustTreeNodeClass = `
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
  pub val: i32,
  pub left: Option<Rc<RefCell<TreeNode>>>,
  pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
  #[inline]
  pub fn new(val: i32) -> Self {
    TreeNode {
      val,
      left: None,
      right: None
    }
  }
}
`; 
// Note: rustGraphNodeClass not a separate export; GraphNode included in generateRustRunner output

export const rustHelperMethods = `
pub trait CojudgeDisplay {
    fn to_cojudge_string(&self) -> String;
}

impl CojudgeDisplay for i32 {
    fn to_cojudge_string(&self) -> String { self.to_string() }
}

impl CojudgeDisplay for bool {
    fn to_cojudge_string(&self) -> String { self.to_string() }
}

impl CojudgeDisplay for String {
    fn to_cojudge_string(&self) -> String { self.clone() }
}

impl CojudgeDisplay for Vec<String> {
    fn to_cojudge_string(&self) -> String {
        let mut res = String::from("[");
        for (i, s) in self.iter().enumerate() {
            if i > 0 { res.push(','); }
            res.push('"');
            res.push_str(s);
            res.push('"');
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for Vec<Vec<String>> {
    fn to_cojudge_string(&self) -> String {
        let mut res = String::from("[");
        for (i, v) in self.iter().enumerate() {
            if i > 0 { res.push(','); }
            res.push_str(&v.to_cojudge_string());
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for Vec<i32> {
    fn to_cojudge_string(&self) -> String {
        let mut res = String::from("[");
        for (i, n) in self.iter().enumerate() {
            if i > 0 { res.push(','); }
            res.push_str(&n.to_string());
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for Vec<Vec<i32>> {
    fn to_cojudge_string(&self) -> String {
        let mut res = String::from("[");
        for (i, v) in self.iter().enumerate() {
            if i > 0 { res.push(','); }
            res.push_str(&v.to_cojudge_string());
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for Vec<Vec<char>> {
    fn to_cojudge_string(&self) -> String {
        let mut res = String::from("[");
        for (i, v) in self.iter().enumerate() {
            if i > 0 { res.push(','); }
            let inner: String = v.iter().collect();
            res.push_str(&inner);
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for Option<Box<ListNode>> {
    fn to_cojudge_string(&self) -> String {
        let mut res = String::from("[");
        let mut curr = self.as_ref();
        while let Some(node) = curr {
            res.push_str(&node.val.to_string());
            if node.next.is_some() {
                res.push_str(", ");
            }
            curr = node.next.as_ref();
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for () {
    fn to_cojudge_string(&self) -> String { "void".to_string() }
}

impl CojudgeDisplay for Option<Rc<RefCell<GraphNode>>> {
    fn to_cojudge_string(&self) -> String {
        if self.is_none() { return "[]".to_string(); }
        let mut adj: std::collections::BTreeMap<i32, Vec<i32>> = std::collections::BTreeMap::new();
        let mut visited = std::collections::HashSet::new();
        let mut q = std::collections::VecDeque::new();
        q.push_back(self.clone());
        visited.insert(self.as_ref().unwrap().borrow().val);
        while let Some(cur) = q.pop_front() {
            if let Some(cur_rc) = cur {
                let cur_node = cur_rc.borrow();
                let mut neighbors = Vec::new();
                for n_opt in &cur_node.neighbors {
                    if let Some(n_rc) = n_opt {
                        let n = n_rc.borrow();
                        neighbors.push(n.val);
                        if visited.insert(n.val) {
                            q.push_back(Some(n_rc.clone()));
                        }
                    }
                }
                adj.insert(cur_node.val, neighbors);
            }
        }
        let mut res = String::from("[");
        let mut first = true;
        for i in 1..=adj.len() as i32 {
            if !first { res.push(','); }
            first = false;
            res.push('[');
            if let Some(neighbors) = adj.get(&i) {
                for (j, v) in neighbors.iter().enumerate() {
                    if j > 0 { res.push(','); }
                    res.push_str(&v.to_string());
                }
            }
            res.push(']');
        }
        res.push(']');
        res
    }
}

impl CojudgeDisplay for Option<Rc<RefCell<TreeNode>>> {
    fn to_cojudge_string(&self) -> String {
        if self.is_none() { return "[]".to_string(); }
        let mut res = Vec::new();
        let mut q = std::collections::VecDeque::new();
        q.push_back(self.clone());
        while !q.is_empty() {
            let curr = q.pop_front().unwrap();
            if let Some(node) = curr {
                let n = node.borrow();
                res.push(Some(n.val));
                q.push_back(n.left.clone());
                q.push_back(n.right.clone());
            } else {
                res.push(None);
            }
        }
        while res.last() == Some(&None) { res.pop(); }
        let parts: Vec<String> = res.into_iter()
            .map(|x| match x {
                Some(v) => v.to_string(),
                None => "null".to_string()
            })
            .collect();
        format!("[{}]", parts.join(", "))
    }
}

pub fn to_list_node(s: &str) -> Option<Box<ListNode>> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return None; }
    let s = s.strip_prefix('[').unwrap_or(s).strip_suffix(']').unwrap_or(s);
    let values: Vec<i32> = s.split(',')
        .filter_map(|part| part.trim().parse::<i32>().ok())
        .collect();
    if values.is_empty() { return None; }
    let mut dummy = Box::new(ListNode::new(0));
    let mut curr: &mut ListNode = &mut dummy;
    for &v in &values {
        curr.next = Some(Box::new(ListNode::new(v)));
        curr = curr.next.as_mut().unwrap();
    }
    dummy.next.take()
}

pub fn add_cycle(head: Option<Box<ListNode>>, pos: i32) -> Option<Box<ListNode>> {
    if pos < 0 { return head; }
    
    let mut raw: Vec<*mut ListNode> = Vec::new();
    let mut curr = head;
    while let Some(mut node) = curr {
        let next = node.next.take();
        raw.push(Box::into_raw(node));
        curr = next;
    }
    
    let n = raw.len();
    let p = pos as usize;
    if n == 0 || p >= n { return None; }
    
    unsafe {
        for i in 0..n-1 {
            (*raw[i]).next = Some(Box::from_raw(raw[i+1]));
        }
        (*raw[n-1]).next = Some(Box::from_raw(raw[p]));
        Some(Box::from_raw(raw[0]))
    }
}

pub fn to_tree_node(s: &str) -> Option<Rc<RefCell<TreeNode>>> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return None; }
    let s = s.strip_prefix('[').unwrap_or(s).strip_suffix(']').unwrap_or(s);
    let parts: Vec<&str> = s.split(',').map(|x| x.trim()).collect();
    if parts.is_empty() || parts[0] == "null" || parts[0].is_empty() { return None; }

    let root_val = parts[0].parse::<i32>().ok()?;
    let root = Rc::new(RefCell::new(TreeNode::new(root_val)));
    let mut q = std::collections::VecDeque::new();
    q.push_back(root.clone());

    let mut i = 1;
    while i < parts.len() && !q.is_empty() {
        let curr = q.pop_front().unwrap();

        // Left child
        if i < parts.len() && parts[i] != "null" && !parts[i].is_empty() {
            if let Ok(val) = parts[i].parse::<i32>() {
                let left = Rc::new(RefCell::new(TreeNode::new(val)));
                curr.borrow_mut().left = Some(left.clone());
                q.push_back(left);
            }
        }
        i += 1;

        // Right child
        if i < parts.len() && parts[i] != "null" && !parts[i].is_empty() {
            if let Ok(val) = parts[i].parse::<i32>() {
                let right = Rc::new(RefCell::new(TreeNode::new(val)));
                curr.borrow_mut().right = Some(right.clone());
                q.push_back(right);
            }
        }
        i += 1;
    }
    Some(root)
}

pub fn to_int_array(s: &str) -> Vec<i32> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return vec![]; }
    let s = s.strip_prefix('[').unwrap_or(s).strip_suffix(']').unwrap_or(s);
    s.split(',')
        .map(|x| x.trim().parse::<i32>().unwrap_or(0))
        .collect()
}

pub fn to_int_array_2d(s: &str) -> Vec<Vec<i32>> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return vec![]; }
    let s = s.strip_prefix('[').unwrap_or(s).strip_suffix(']').unwrap_or(s);
    let mut res: Vec<Vec<i32>> = vec![];
    let mut depth = 0i32;
    let mut start = 0usize;
    for (i, c) in s.char_indices() {
        if c == '[' {
            if depth == 0 { start = i; }
            depth += 1;
        }
        else if c == ']' {
            depth -= 1;
            if depth == 0 {
                let part = s[start..=i].trim();
                if !part.is_empty() { res.push(to_int_array(part)); }
            }
        }
    }
    res
}

pub fn to_graph_node(s: &str) -> Option<Rc<RefCell<GraphNode>>> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return None; }
    let adj = to_int_array_2d(s);
    let mut nodes: Vec<Rc<RefCell<GraphNode>>> = (0..adj.len())
        .map(|i| Rc::new(RefCell::new(GraphNode::new((i + 1) as i32))))
        .collect();
    for i in 0..adj.len() {
        for &nb in &adj[i] {
            let idx = (nb - 1) as usize;
            if idx < nodes.len() {
                nodes[i].borrow_mut().neighbors.push(Some(nodes[idx].clone()));
            }
        }
    }
    nodes.into_iter().next()
}

pub fn to_string_array(s: &str) -> Vec<String> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return vec![]; }
    let s = s.strip_prefix('[').unwrap_or(s).strip_suffix(']').unwrap_or(s);
    // Rough estimate for string array parsing
    let mut res = vec![];
    let mut current = String::new();
    let mut in_quotes = false;
    for c in s.chars() {
        if c == '"' { in_quotes = !in_quotes; }
        else if c == ',' && !in_quotes {
            res.push(current.trim().trim_matches('"').to_string());
            current = String::new();
        } else {
            current.push(c);
        }
    }
    res.push(current.trim().trim_matches('"').to_string());
    res
}
`;

export const rustListNodeMain = `
mod list_node;
use list_node::ListNode;
`;

export const rustTreeNodeMain = `
mod tree_node;
use tree_node::{TreeNode};
use std::rc::Rc;
use std::cell::RefCell;
`;

export function rustEscapeStringLiteral(str: string): string {
  if (str === null || str === undefined) return '""';
  const escaped = String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

export function rustGetFullParam(params: Param[], tc: any): string {
  const parts: string[] = [];
  for (const p of params) {
    const val = tc[p.name];
    if (p.type === "string") {
      parts.push(`${rustEscapeStringLiteral(val ?? "")}.to_string()`);
    } else if (p.type === "int_array") {
      parts.push(`to_int_array(${rustEscapeStringLiteral(val ?? "[]")})`);
    } else if (p.type === "int") {
      parts.push(`${val}`);
    } else if (p.type === "boolean") {
      parts.push(String(val) === "true" ? "true" : "false");
    } else if (p.type === "string_array") {
      let strVal: string;
      if (Array.isArray(val)) {
        try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
      } else {
        strVal = String(val ?? '[]');
      }
      parts.push(
        `to_string_array(${rustEscapeStringLiteral(strVal)})`,
      );
    } else if (p.type === "int_array_2d" || p.type === "int_matrix") {
      let strVal: string;
      if (Array.isArray(val)) {
        try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
      } else {
        strVal = String(val ?? '[]');
      }
      parts.push(`to_int_array_2d(${rustEscapeStringLiteral(strVal)})`);
    } else if (p.type === "list_node") {
      parts.push(
        `add_cycle(to_list_node(${rustEscapeStringLiteral(String(val ?? "[]"))}), ${tc.pos !== undefined ? tc.pos : -1})`,
      );
    } else if (p.type === "tree_node") {
      parts.push(
        `to_tree_node(${rustEscapeStringLiteral(String(val ?? "[]"))})`,
      );
    } else if (p.type === "graph_node") {
      parts.push(
        `to_graph_node(${rustEscapeStringLiteral(String(val ?? "[]"))})`,
      );
    } else {
      parts.push(`${rustEscapeStringLiteral(String(val ?? ""))}.to_string()`);
    }
  }
  return parts.join(", ");
}

const rustStringOpMap: Record<string, { void: boolean, code: string }> = {
    addWord: { void: true, code: `o.add_word(values[i].clone());` },
    insert: { void: true, code: `o.insert(values[i].clone());` },
    search: { void: false, code: `o.search(values[i].clone()).to_string()` },
    startsWith: { void: false, code: `o.starts_with(values[i].clone()).to_string()` },
};

function generateRustBranches(operations: string[], isInt: boolean): string {
    return operations.map((op, i) => {
        const cond = i === 0 ? 'if' : 'else if';
        if (isInt) {
            if (op === 'addNum') {
                return `            } ${cond} op == "addNum" {\n                if let Some(ref mut o) = obj {\n                    o.add_num(values[i][0]);\n                }\n                result.push("null".to_string());`;
            } else if (op === 'findMedian') {
                return `            } ${cond} op == "findMedian" {\n                if let Some(ref o) = obj {\n                    let med = o.find_median();\n                    if med == (med as i64) as f64 {\n                        result.push(format!("{}.0", med as i64));\n                    } else {\n                        result.push(format!("{}", med));\n                    }\n                }`;
            }
            return '';
        }
        const entry = rustStringOpMap[op];
        if (!entry) return '';
        if (entry.void) {
            return `            } ${cond} op == "${op}" {\n                if let Some(ref mut o) = obj {\n                    ${entry.code}\n                }\n                result.push("null".to_string());`;
        } else {
            return `            } ${cond} op == "${op}" {\n                if let Some(ref o) = obj {\n                    result.push(${entry.code});\n                }`;
        }
    }).join('\n');
}

export function generateRustClassSolution(className: string, params?: Param[], outputType?: string, operations?: string[]): string {
  if (params && params.length > 0 && params[0]?.type === 'tree_node') {
    return `
pub struct Solution;

impl Solution {
    pub fn solve(root: Option<Rc<RefCell<TreeNode>>>) -> Option<Rc<RefCell<TreeNode>>> {
        let ser = ${className}::new();
        let deser = ${className}::new();
        deser.deserialize(ser.serialize(root))
    }
}
`;
  }
  if (params && params.length === 1 && params[0]?.type === 'string_array') {
    return `
pub struct Solution;

impl Solution {
    pub fn solve(strs: Vec<String>) -> Vec<String> {
        let codec = ${className}::new();
        let encoded = codec.encode(strs);
        codec.decode(encoded)
    }
}
`;
  }
  if (params && params.length > 1 && params[1]?.type === 'string_array') {
    const ops = operations || ['addWord', 'insert', 'search', 'startsWith'];
    const branches = generateRustBranches(ops, false);
    return `
pub struct Solution;

impl Solution {
    pub fn solve(operations: Vec<String>, values: Vec<String>) -> Vec<String> {
        let mut result = Vec::new();
        let mut obj: Option<${className}> = None;
        for (i, op) in operations.iter().enumerate() {
            if op == "${className}" {
                obj = Some(${className}::new());
                result.push("null".to_string());
${branches}
            }
        }
        result
    }
}
`;
  }
  const ops = operations || ['addNum', 'findMedian'];
  const branches = generateRustBranches(ops, true);
  return `
pub struct Solution;

impl Solution {
    pub fn solve(operations: Vec<String>, values: Vec<Vec<i32>>) -> Vec<String> {
        let mut result = Vec::new();
        let mut obj: Option<${className}> = None;
        for (i, op) in operations.iter().enumerate() {
            if op == "${className}" {
                obj = Some(${className}::new());
                result.push("null".to_string());
${branches}
            }
        }
        result
    }
}
`;
}

export function generateRustDebugRunner(
  functionName: string,
  params: Param[],
  testCases: any[],
  className?: string,
  checkGraphClone?: boolean,
): string {
  const snakedFunctionName = functionName
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");

  const prefix = className ? `solution::${className}` : 'solution::Solution';
  const hasGraphNode = checkGraphClone && params.some(p => p.type === 'graph_node');

  const calls = testCases
    .map((tc, caseIndex) => {
      if (hasGraphNode) {
        const decls: string[] = [];
        const args: string[] = [];
        params.forEach((p, i) => {
          const val = tc[p.name];
          const varName = `__input${caseIndex}_${i}`;
          if (p.type === 'graph_node') {
            const escaped = String(val ?? '[]').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            decls.push(`let ${varName} = to_graph_node("${escaped}");`);
            args.push(`${varName}.clone()`);
          } else {
            args.push(rustGetFullParam([p], tc));
          }
        });
        const graphNodeVar = args.find((_, i) => params[i]?.type === 'graph_node');
        if (graphNodeVar) {
          const inputVar = graphNodeVar.replace('.clone()', '');
          return `{
        ${decls.join('\n        ')}
        let res = ${prefix}::${snakedFunctionName}(${args.join(', ')});
        let same_ref = match (&${inputVar}, &res) {
            (Some(a), Some(b)) => Rc::ptr_eq(a, b),
            _ => false,
        };
        if same_ref {
            println!(":::ERROR:::invalid clone - same object");
        } else {
            println!(":::RESULT:::{}", res.to_cojudge_string());
        }
        println!("---");
    }`;
        }
      }
      const args = rustGetFullParam(params, tc);
      return `{
        let res = ${prefix}::${snakedFunctionName}(${args});
        println!(":::RESULT:::{}", res.to_cojudge_string());
        println!("---");
    }`;
    })
    .join("\n    ");

  const operations = extractOperations(testCases, className || '');
  const solutionCode = className ? generateRustClassSolutionDebug(className, params, undefined, operations) : '';

  return `
use std::rc::Rc;
use std::cell::RefCell;
use std::collections::VecDeque;

mod solution;

${rustListNodeClass}

${rustTreeNodeClass}

// GraphNode
#[derive(Debug, PartialEq, Eq)]
pub struct GraphNode {
  pub val: i32,
  pub neighbors: Vec<Option<Rc<RefCell<GraphNode>>>>,
}

impl GraphNode {
  #[inline]
  pub fn new(val: i32) -> Self {
    GraphNode {
      val,
      neighbors: vec![]
    }
  }
}

// Solution wrapper
${solutionCode}

// Helper methods for display
${rustHelperMethods}

fn main() {
    ${calls}
}
`;
}

function generateRustClassSolutionDebug(className: string, params?: Param[], outputType?: string, operations?: string[]): string {
  if (params && params.length > 0 && params[0]?.type === 'tree_node') {
    return `
pub struct Solution;

impl Solution {
    pub fn solve(root: Option<Rc<RefCell<TreeNode>>>) -> Option<Rc<RefCell<TreeNode>>> {
        let ser = solution::${className}::new();
        let deser = solution::${className}::new();
        deser.deserialize(ser.serialize(root))
    }
}
`;
  }
  if (params && params.length === 1 && params[0]?.type === 'string_array') {
    return `
pub struct Solution;

impl Solution {
    pub fn solve(strs: Vec<String>) -> Vec<String> {
        let codec = solution::${className}::new();
        let encoded = codec.encode(strs);
        codec.decode(encoded)
    }
}
`;
  }
  if (params && params.length > 1 && params[1]?.type === 'string_array') {
    const ops = operations || ['addWord', 'insert', 'search', 'startsWith'];
    const branches = generateRustBranches(ops, false);
    return `
pub struct Solution;

impl Solution {
    pub fn solve(operations: Vec<String>, values: Vec<String>) -> Vec<String> {
        let mut result = Vec::new();
        let mut obj: Option<solution::${className}> = None;
        for (i, op) in operations.iter().enumerate() {
            if op == "${className}" {
                obj = Some(solution::${className}::new());
                result.push("null".to_string());
${branches}
            }
        }
        result
    }
}
`;
  }
  const ops = operations || ['addNum', 'findMedian'];
  const branches = generateRustBranches(ops, true);
  return `
pub struct Solution;

impl Solution {
    pub fn solve(operations: Vec<String>, values: Vec<Vec<i32>>) -> Vec<String> {
        let mut result = Vec::new();
        let mut obj: Option<solution::${className}> = None;
        for (i, op) in operations.iter().enumerate() {
            if op == "${className}" {
                obj = Some(solution::${className}::new());
                result.push("null".to_string());
${branches}
            }
        }
        result
    }
}
`;
}

export function generateRustRunner(
  functionName: string,
  params: Param[],
  testCases: any[],
  code: string,
  className?: string,
  checkGraphClone?: boolean,
): string {
  const snakedFunctionName = functionName
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");

  const hasGraphNode = checkGraphClone && params.some(p => p.type === 'graph_node');

  const calls = testCases
    .map((tc, caseIndex) => {
      if (hasGraphNode) {
        const decls: string[] = [];
        const args: string[] = [];
        params.forEach((p, i) => {
          const val = tc[p.name];
          const varName = `__input${caseIndex}_${i}`;
          if (p.type === 'graph_node') {
            const escaped = String(val ?? '[]').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            decls.push(`let ${varName} = to_graph_node("${escaped}");`);
            args.push(`${varName}.clone()`);
          } else {
            args.push(rustGetFullParam([p], tc));
          }
        });
        const graphNodeVar = args.find((_, i) => params[i]?.type === 'graph_node');
        if (graphNodeVar) {
          const inputVar = graphNodeVar.replace('.clone()', '');
          return `{
        ${decls.join('\n        ')}
        let res = Solution::${snakedFunctionName}(${args.join(', ')});
        let same_ref = match (&${inputVar}, &res) {
            (Some(a), Some(b)) => Rc::ptr_eq(a, b),
            _ => false,
        };
        if same_ref {
            println!(":::ERROR:::invalid clone - same object");
        } else {
            println!(":::RESULT:::{}", res.to_cojudge_string());
        }
        println!("---");
    }`;
        }
      }
      const args = rustGetFullParam(params, tc);
      return `{
        let res = Solution::${snakedFunctionName}(${args});
        println!(":::RESULT:::{}", res.to_cojudge_string());
        println!("---");
    }`;
    })
    .join("\n    ");

  // Remove common imports from user code to avoid "defined multiple times" errors
  const cleanedCode = (code || "")
    .replace(/use std::rc::Rc;/g, "// use std::rc::Rc;")
    .replace(/use std::cell::RefCell;/g, "// use std::cell::RefCell;")
    .replace(
      /use std::collections::VecDeque;/g,
      "// use std::collections::VecDeque;",
    );

  const operations = extractOperations(testCases, className || '');
  const solutionCode = className ? generateRustClassSolution(className, params, undefined, operations) : '';

  return `
use std::rc::Rc;
use std::cell::RefCell;
use std::collections::VecDeque;

${rustListNodeClass}

${rustTreeNodeClass}

// GraphNode
#[derive(Debug, PartialEq, Eq)]
pub struct GraphNode {
  pub val: i32,
  pub neighbors: Vec<Option<Rc<RefCell<GraphNode>>>>,
}

impl GraphNode {
  #[inline]
  pub fn new(val: i32) -> Self {
    GraphNode {
      val,
      neighbors: vec![]
    }
  }
}

// User code
${cleanedCode}

// Solution wrapper
${solutionCode}

// Helper methods for display
${rustHelperMethods}

fn main() {
    ${calls}
}
`;
}
