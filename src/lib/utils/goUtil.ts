import type { Param } from "./util";
import { extractOperations } from "./util";
import { env } from '$env/dynamic/private';

// Docker image for running Go code. Override via COJUDGE_GO_IMAGE env var.
// On memory-constrained machines, build a custom image with pre-compiled
// stdlib: see docker/go/Dockerfile for instructions.
export const goImage = env.COJUDGE_GO_IMAGE || 'golang:1.22-alpine';

export const goListNodeClass = `
type ListNode struct {
    Val int
    Next *ListNode
}
`;

export const goTreeNodeClass = `
type TreeNode struct {
    Val int
    Left *TreeNode
    Right *TreeNode
}
`;

export const goGraphNodeClass = `
type GraphNode struct {
    Val int
    Neighbors []*GraphNode
}
`;

export const goImports = `
import (
    "fmt"
    "strconv"
    "strings"
)
`;

export const goHelperMethods = `
func displayOutput(x interface{}) string {
    switch v := x.(type) {
    case nil:
        return "null"
    case int:
        return strconv.Itoa(v)
    case bool:
        if v {
            return "true"
        }
        return "false"
    case string:
        return v
    case []int:
        parts := make([]string, len(v))
        for i, n := range v {
            parts[i] = strconv.Itoa(n)
        }
        return "[" + strings.Join(parts, ",") + "]"
    case [][]int:
        parts := make([]string, len(v))
        for i, row := range v {
            parts[i] = displayOutput(row)
        }
        return "[" + strings.Join(parts, ",") + "]"
    case []string:
        quoted := make([]string, len(v))
        for i, s := range v {
            quoted[i] = "\\"" + s + "\\""
        }
        return "[" + strings.Join(quoted, ",") + "]"
    case [][]string:
        parts := make([]string, len(v))
        for i, row := range v {
            parts[i] = displayOutput(row)
        }
        return "[" + strings.Join(parts, ",") + "]"
    case []byte:
        parts := make([]string, len(v))
        for i, b := range v {
            parts[i] = string(b)
        }
        return "[" + strings.Join(parts, ",") + "]"
    case [][]byte:
        parts := make([]string, len(v))
        for i, row := range v {
            parts[i] = displayOutput(row)
        }
        return "[" + strings.Join(parts, ",") + "]"
    case *ListNode:
        if v == nil {
            return "[]"
        }
        var res []string
        for cur := v; cur != nil; cur = cur.Next {
            res = append(res, strconv.Itoa(cur.Val))
        }
        return "[" + strings.Join(res, ",") + "]"
    case *TreeNode:
        if v == nil {
            return "[]"
        }
        var out []string
        queue := []*TreeNode{v}
        for len(queue) > 0 {
            node := queue[0]
            queue = queue[1:]
            if node == nil {
                out = append(out, "null")
            } else {
                out = append(out, strconv.Itoa(node.Val))
                queue = append(queue, node.Left, node.Right)
            }
        }
        for len(out) > 0 && out[len(out)-1] == "null" {
            out = out[:len(out)-1]
        }
        return "[" + strings.Join(out, ",") + "]"
    case *GraphNode:
        if v == nil {
            return "[]"
        }
        adj := make(map[int][]int)
        visited := make(map[*GraphNode]bool)
        queue := []*GraphNode{v}
        visited[v] = true
        for len(queue) > 0 {
            cur := queue[0]
            queue = queue[1:]
            var neighbors []int
            for _, n := range cur.Neighbors {
                neighbors = append(neighbors, n.Val)
                if !visited[n] {
                    visited[n] = true
                    queue = append(queue, n)
                }
            }
            adj[cur.Val] = neighbors
        }
        var keys []int
        for k := range adj {
            keys = append(keys, k)
        }
        // sort keys
        for i := 0; i < len(keys); i++ {
            for j := i + 1; j < len(keys); j++ {
                if keys[i] > keys[j] {
                    keys[i], keys[j] = keys[j], keys[i]
                }
            }
        }
        var parts []string
        for _, k := range keys {
            neighbors := adj[k]
            var nbParts []string
            for _, nb := range neighbors {
                nbParts = append(nbParts, strconv.Itoa(nb))
            }
            parts = append(parts, "["+strings.Join(nbParts, ",")+"]")
        }
        return "[" + strings.Join(parts, ",") + "]"
    default:
        return fmt.Sprintf("%v", x)
    }
}

func toIntArray(s string) []int {
    s = strings.TrimSpace(s)
    if s == "[]" || s == "" {
        return []int{}
    }
    s = s[1 : len(s)-1]
    parts := strings.Split(s, ",")
    res := make([]int, 0, len(parts))
    for _, p := range parts {
        p = strings.TrimSpace(p)
        if p == "" {
            continue
        }
        n, _ := strconv.Atoi(p)
        res = append(res, n)
    }
    return res
}

func toIntArray2d(s string) [][]int {
    s = strings.TrimSpace(s)
    if s == "[]" || s == "" {
        return [][]int{}
    }
    s = s[1 : len(s)-1]
    var res [][]int
    depth := 0
    start := 0
    for i, c := range s {
        if c == '[' {
            if depth == 0 {
                start = i
            }
            depth++
        } else if c == ']' {
            depth--
            if depth == 0 {
                part := strings.TrimSpace(s[start : i+1])
                if part != "" {
                    res = append(res, toIntArray(part))
                }
            }
        }
    }
    return res
}

func toStringArray(s string) []string {
    s = strings.TrimSpace(s)
    if s == "[]" || s == "" {
        return []string{}
    }
    s = s[1 : len(s)-1]
    var res []string
    var cur strings.Builder
    inDQ := false
    inSQ := false
    for _, c := range s {
        if c == '"' && !inSQ {
            inDQ = !inDQ
            continue
        }
        if c == '\\'' && !inDQ {
            inSQ = !inSQ
            continue
        }
        if c == ',' && !inDQ && !inSQ {
            token := strings.TrimSpace(cur.String())
            res = append(res, token)
            cur.Reset()
        } else {
            cur.WriteRune(c)
        }
    }
    last := strings.TrimSpace(cur.String())
    res = append(res, last)
    return res
}

func toStringList2d(s string) [][]string {
    s = strings.TrimSpace(s)
    if s == "[]" || s == "" {
        return [][]string{}
    }
    s = s[1 : len(s)-1]
    var res [][]string
    depth := 0
    start := 0
    for i, c := range s {
        if c == '[' {
            if depth == 0 {
                start = i
            }
            depth++
        } else if c == ']' {
            depth--
            if depth == 0 {
                part := strings.TrimSpace(s[start : i+1])
                if part != "" {
                    res = append(res, toStringArray(part))
                }
            }
        } else if c == ',' && depth == 0 {
            // top-level comma separator
        }
    }
    return res
}

func toByteArray2d(s string) [][]byte {
    s = strings.TrimSpace(s)
    if s == "[]" || s == "" {
        return [][]byte{}
    }
    s = s[1 : len(s)-1]
    var res [][]byte
    depth := 0
    start := 0
    for i, c := range s {
        if c == '[' {
            if depth == 0 {
                start = i
            }
            depth++
        } else if c == ']' {
            depth--
            if depth == 0 {
                part := strings.TrimSpace(s[start : i+1])
                if part != "" {
                    strArr := toStringArray(part)
                    row := make([]byte, len(strArr))
                    for j, str := range strArr {
                        if len(str) > 0 {
                            row[j] = str[0]
                        }
                    }
                    res = append(res, row)
                }
            }
        }
    }
    return res
}

func toListNode(s string) *ListNode {
    nums := toIntArray(s)
    if len(nums) == 0 {
        return nil
    }
    dummy := &ListNode{}
    cur := dummy
    for _, v := range nums {
        cur.Next = &ListNode{Val: v}
        cur = cur.Next
    }
    return dummy.Next
}

func addCycle(head *ListNode, pos int) *ListNode {
    if pos < 0 || head == nil {
        return head
    }
    cur := head
    var cycleNode *ListNode
    i := 0
    for cur != nil {
        if i == pos {
            cycleNode = cur
        }
        if cur.Next == nil {
            break
        }
        cur = cur.Next
        i++
    }
    if cycleNode != nil {
        cur.Next = cycleNode
    }
    return head
}

func toListNodeArray(s string) []*ListNode {
    strArr := toStringArray(s)
    res := make([]*ListNode, len(strArr))
    for i, part := range strArr {
        res[i] = toListNode(part)
    }
    return res
}

func toTreeNode(s string) *TreeNode {
    s = strings.TrimSpace(s)
    if s == "[]" || s == "" {
        return nil
    }
    s = s[1 : len(s)-1]
    parts := strings.Split(s, ",")
    for i := range parts {
        parts[i] = strings.TrimSpace(parts[i])
    }
    if len(parts) == 0 || parts[0] == "null" || parts[0] == "" {
        return nil
    }
    rootVal, _ := strconv.Atoi(parts[0])
    root := &TreeNode{Val: rootVal}
    queue := []*TreeNode{root}
    idx := 1
    for len(queue) > 0 && idx < len(parts) {
        node := queue[0]
        queue = queue[1:]
        if idx < len(parts) && parts[idx] != "null" && parts[idx] != "" {
            leftVal, _ := strconv.Atoi(parts[idx])
            node.Left = &TreeNode{Val: leftVal}
            queue = append(queue, node.Left)
        }
        idx++
        if idx < len(parts) && parts[idx] != "null" && parts[idx] != "" {
            rightVal, _ := strconv.Atoi(parts[idx])
            node.Right = &TreeNode{Val: rightVal}
            queue = append(queue, node.Right)
        }
        idx++
    }
    return root
}

func toGraphNode(s string) *GraphNode {
    adj := toIntArray2d(s)
    if len(adj) == 0 {
        return nil
    }
    nodes := make([]*GraphNode, len(adj))
    for i := range adj {
        nodes[i] = &GraphNode{Val: i + 1}
    }
    for i, neighbors := range adj {
        for _, nb := range neighbors {
            idx := nb - 1
            if idx >= 0 && idx < len(nodes) {
                nodes[i].Neighbors = append(nodes[i].Neighbors, nodes[idx])
            }
        }
    }
    return nodes[0]
}
`;

function goEscapeStringLiteral(str: string): string {
    if (str === null || str === undefined) return '""';
    const escaped = String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `"${escaped}"`;
}

function goFunctionName(name: string): string {
    if (!name) return name;
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function goType(typeName: string): string {
    switch (typeName) {
        case "int": return "int";
        case "string": return "string";
        case "boolean": return "bool";
        case "int_array": return "[]int";
        case "int_array_2d":
        case "int_matrix": return "[][]int";
        case "string_array":
        case "string_list": return "[]string";
        case "string_list_2d": return "[][]string";
        case "char_array_2d": return "[][]byte";
        case "list_node": return "*ListNode";
        case "list_node_array": return "[]*ListNode";
        case "tree_node": return "*TreeNode";
        case "graph_node": return "*GraphNode";
        default: return "interface{}";
    }
}

export function goGetFullParam(params: Param[], tc: any): string {
    const parts: string[] = [];
    for (const p of params) {
        const val = tc[p.name];
        if (p.type === "string") {
            parts.push(goEscapeStringLiteral(val ?? ""));
        } else if (p.type === "int") {
            parts.push(`${val}`);
        } else if (p.type === "boolean") {
            parts.push(String(val) === "true" ? "true" : "false");
        } else if (p.type === "int_array") {
            parts.push(`toIntArray(${goEscapeStringLiteral(val ?? "[]")})`);
        } else if (p.type === "int_array_2d" || p.type === "int_matrix") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toIntArray2d(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "string_array") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toStringArray(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "string_list") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toStringArray(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "string_list_2d") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toStringList2d(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "char_array_2d") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toByteArray2d(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "list_node") {
            parts.push(`addCycle(toListNode(${goEscapeStringLiteral(String(val ?? "[]"))}), ${tc.pos !== undefined ? tc.pos : -1})`);
        } else if (p.type === "list_node_array") {
            parts.push(`toListNodeArray(${goEscapeStringLiteral(String(val ?? "[]"))})`);
        } else if (p.type === "tree_node") {
            parts.push(`toTreeNode(${goEscapeStringLiteral(String(val ?? "[]"))})`);
        } else if (p.type === "graph_node") {
            parts.push(`toGraphNode(${goEscapeStringLiteral(String(val ?? "[]"))})`);
        } else {
            parts.push(goEscapeStringLiteral(String(val ?? "")));
        }
    }
    return parts.join(", ");
}

const goStringOpMap: Record<string, { void: boolean, code: string }> = {
    addWord: { void: true, code: 'obj.AddWord(values[i])' },
    insert: { void: true, code: 'obj.Insert(values[i])' },
    search: { void: false, code: 'strconv.FormatBool(obj.Search(values[i]))' },
    startsWith: { void: false, code: 'strconv.FormatBool(obj.StartsWith(values[i]))' },
};

function generateGoBranches(operations: string[], isInt: boolean): string {
    return operations.map((op, i) => {
        if (isInt) {
            if (op === 'addNum') {
                return `        } else if op == "addNum" {\n            obj.AddNum(values[i][0])\n            result = append(result, "null")`;
            } else if (op === 'findMedian') {
                return `        } else if op == "findMedian" {\n            med := obj.FindMedian()\n            if med == float64(int64(med)) {\n                result = append(result, fmt.Sprintf("%d.0", int64(med)))\n            } else {\n                result = append(result, strconv.FormatFloat(med, 'f', -1, 64))\n            }`;
            }
            return '';
        }
        const entry = goStringOpMap[op];
        if (!entry) return '';
        if (entry.void) {
            return `        } else if op == "${op}" {\n            ${entry.code}\n            result = append(result, "null")`;
        } else {
            return `        } else if op == "${op}" {\n            result = append(result, ${entry.code})`;
        }
    }).join('\n');
}

export function generateGoClassSolution(className: string, params?: Param[], outputType?: string, operations?: string[]): string {
    if (params && params.length > 0 && params[0]?.type === 'tree_node') {
        return `
func Solve(root *TreeNode) *TreeNode {
    var ser Codec
    var deser Codec
    return deser.Deserialize(ser.Serialize(root))
}`;
    }
    if (params && params.length === 1 && params[0]?.type === 'string_array') {
        return `
func Solve(strs []string) []string {
    var codec ${className}
    encoded := codec.Encode(strs)
    return codec.Decode(encoded)
}`;
    }
    if (params && params.length > 1 && params[1]?.type === 'string_array') {
        const ops = operations || ['addWord', 'insert', 'search', 'startsWith'];
        const branches = generateGoBranches(ops, false);
        return `
func Solve(operations []string, values []string) []string {
    result := []string{}
    var obj *${className}
    for i, op := range operations {
        if op == "${className}" {
            obj = &${className}{}
            result = append(result, "null")
${branches}
        }
    }
    return result
}`;
    }
    const ops = operations || ['addNum', 'findMedian'];
    const branches = generateGoBranches(ops, true);
    return `
func Solve(operations []string, values [][]int) []string {
    result := []string{}
    var obj *${className}
    for i, op := range operations {
        if op == "${className}" {
            obj = &${className}{}
            result = append(result, "null")
${branches}
        }
    }
    return result
}`;
}

export function generateGoRunner(
    functionName: string,
    params: Param[],
    testCases: any[],
    outputType: string,
    className?: string,
    checkGraphClone?: boolean,
): string {
    const fnName = className ? "Solve" : goFunctionName(functionName);
    const hasGraphNode = checkGraphClone && params.some(p => p.type === 'graph_node');

    const calls = testCases
        .map((tc, caseIndex) => {
            if (hasGraphNode) {
                const decls: string[] = [];
                const args: string[] = [];
                params.forEach((p, i) => {
                    const val = tc[p.name];
                    const varName = `p${caseIndex}_${i}`;
                    if (p.type === 'graph_node') {
                        decls.push(`${varName} := toGraphNode(${goEscapeStringLiteral(String(val ?? "[]"))})`);
                        args.push(varName);
                    } else {
                        args.push(goGetFullParam([p], tc));
                    }
                });
                const graphNodeArg = args.find((_, i) => params[i]?.type === 'graph_node')!;
                return `{
        ${decls.join('\n        ')}
        res := ${fnName}(${args.join(', ')})
        if ${graphNodeArg} != nil && res == ${graphNodeArg} {
            fmt.Println(":::ERROR:::invalid clone - same object")
        } else {
            fmt.Println(":::RESULT:::" + displayOutput(res))
        }
        fmt.Println("---")
    }`;
            }
            const args = goGetFullParam(params, tc);
            return `{
        res := ${fnName}(${args})
        fmt.Println(":::RESULT:::" + displayOutput(res))
        fmt.Println("---")
    }`;
        })
        .join("\n        ");

    const operations = extractOperations(testCases, className || '');
    const solutionCode = className ? generateGoClassSolution(className, params, outputType, operations) : '';

    return `package main

${goImports}
${goListNodeClass}

${goTreeNodeClass}

${goGraphNodeClass}

${goHelperMethods}

${solutionCode}

func main() {
    ${calls}
}
`;
}

export function generateGoStarterCode(functionName: string, params: Param[], outputType: string, classProblem?: any): string {
    const fnName = goFunctionName(functionName);

    if (classProblem) {
        const className = classProblem.userClassName || 'Codec';
        if (params && params.length > 0 && params[0]?.type === 'tree_node') {
            return `package main

type ${className} struct {
    
}

func (c *${className}) Serialize(root *TreeNode) string {
    
}

func (c *${className}) Deserialize(data string) *TreeNode {
    
}`;
        }
        return `package main

type ${className} struct {
    
}

func Constructor() ${className} {
    return ${className}{}
}

func (this *${className}) AddNum(num int) {
    
}

func (this *${className}) FindMedian() float64 {
    return 0.0
}`;
    }

    const paramStrs = params.map(p => {
        return `${p.name} ${goType(p.type)}`;
    });
    const returnType = goType(outputType);

    return `package main

func ${fnName}(${paramStrs.join(', ')}) ${returnType} {
    
}`;
}
