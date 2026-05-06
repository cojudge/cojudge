import type { Param } from './util';

export const rustImage = 'rust:1.78-slim';

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
`;

export const rustTreeNodeClass = `
use std::rc::Rc;
use std::cell::RefCell;

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

export const rustHelperMethods = `
use std::collections::VecDeque;

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

impl<T: std::fmt::Debug> CojudgeDisplay for Vec<T> {
    fn to_cojudge_string(&self) -> String { format!("{:?}", self) }
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

pub fn to_int_array(s: &str) -> Vec<i32> {
    let s = s.trim();
    if s == "[]" || s.is_empty() { return vec![]; }
    let s = s.strip_prefix('[').unwrap_or(s).strip_suffix(']').unwrap_or(s);
    s.split(',')
        .map(|x| x.trim().parse::<i32>().unwrap_or(0))
        .collect()
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
    const escaped = String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
}

export function rustGetFullParam(params: Param[], tc: any): string {
    const parts: string[] = [];
    for (const p of params) {
        const val = tc[p.name];
        if (p.type === 'string') {
            parts.push(`${rustEscapeStringLiteral(val ?? "")}.to_string()`);
        } else if (p.type === 'int_array') {
            parts.push(`to_int_array(${rustEscapeStringLiteral(val ?? "[]")})`);
        } else if (p.type === 'int') {
            parts.push(`${val}`);
        } else if (p.type === 'boolean') {
            parts.push(String(val) === 'true' ? 'true' : 'false');
        } else if (p.type === 'string_array') {
            parts.push(`to_string_array(${rustEscapeStringLiteral(JSON.stringify(val ?? []))})`);
        } else {
            parts.push(`${rustEscapeStringLiteral(String(val ?? ""))}.to_string()`);
        }
    }
    return parts.join(', ');
}

export function generateRustRunner(functionName: string, params: Param[], testCases: any[]): string {
    // Determine which modules are needed
    let imports = '';
    if (params.some(p => p.type.includes('list_node')) || params.some(p => p.type.includes('tree_node'))) {
        // Simple heuristic
    }
    
    // We'll just include them all for simplicity in the prototype
    imports += rustListNodeMain;
    imports += rustTreeNodeMain;

    const snakedFunctionName = functionName.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");

    const calls = testCases
        .map((tc, caseIndex) => {
            const args = rustGetFullParam(params, tc);
            return `{
        let res = Solution::${snakedFunctionName}(${args});
        println!(":::RESULT:::{}", res.to_cojudge_string());
        println!("---");
    }`;
        })
        .join('\n    ');

    return `
${imports}
mod solution;
use solution::Solution;

${rustHelperMethods}

fn main() {
    ${calls}
}
`;
}
