import type { Param } from "./util";
import type { InteractiveConfig } from "./interactiveUtil";
import { interactiveBudget, isTranscriptKind } from "./interactiveUtil";
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
    "time"
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
    case []*ListNode:
        parts := make([]string, len(v))
        for i, n := range v {
            parts[i] = displayOutput(n)
        }
        return "[" + strings.Join(parts, ",") + "]"
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
    depth := 0
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
        if c == '[' {
            depth++
        } else if c == ']' {
            depth--
        }
        if c == ',' && !inDQ && !inSQ && depth == 0 {
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
        case "int_list_2d":
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
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`toIntArray(${goEscapeStringLiteral(strVal)})`);
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
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? "[]");
            }
            parts.push(`addCycle(toListNode(${goEscapeStringLiteral(strVal)}), ${tc.pos !== undefined ? tc.pos : -1})`);
        } else if (p.type === "list_node_array") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? "[]");
            }
            parts.push(`toListNodeArray(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "tree_node") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? "[]");
            }
            parts.push(`toTreeNode(${goEscapeStringLiteral(strVal)})`);
        } else if (p.type === "graph_node") {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? "[]");
            }
            parts.push(`toGraphNode(${goEscapeStringLiteral(strVal)})`);
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
            __obj := Constructor()
            obj = &__obj
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
            __obj := Constructor()
            obj = &__obj
            result = append(result, "null")
${branches}
        }
    }
    return result
}`;
}

export const goMasterClass = `
type Master struct {
    secret string
    wordSet map[string]bool
    maxGuesses int
    guessCount int
    solved bool
    history []string
    scores []int
}

func NewMaster(secret string, wordlist []string, maxGuesses int) *Master {
    ws := make(map[string]bool)
    for _, w := range wordlist {
        ws[w] = true
    }
    return &Master{secret: secret, wordSet: ws, maxGuesses: maxGuesses}
}

func (m *Master) Guess(word string) int {
    m.guessCount++
    m.history = append(m.history, word)
    var res int
    if !m.wordSet[word] {
        res = -1
    } else {
        n := len(word)
        if len(m.secret) < n {
            n = len(m.secret)
        }
        c := 0
        for i := 0; i < n; i++ {
            if word[i] == m.secret[i] {
                c++
            }
        }
        res = c
        if word == m.secret {
            m.solved = true
        }
    }
    m.scores = append(m.scores, res)
    return res
}
`;

export function generateGoInteractiveRunner(
    functionName: string,
    testCases: any[],
    interactive: InteractiveConfig,
): string {
    if (!isTranscriptKind(interactive.kind)) {
        return generateGoJudgeRunner(functionName, testCases, interactive);
    }
    const fnName = goFunctionName(functionName);
    const maxG = interactive.maxGuesses;
    const secretField = interactive.secretField;
    const calls = testCases
        .map((tc, caseIndex) => {
            const wlArg = goGetFullParam([{ name: 'wordlist', type: 'string_array' } as Param], tc);
            const rawSec = String((tc as any)[secretField] ?? '');
            return `{
        __wl := ${wlArg}
        __sec := ${goEscapeStringLiteral(rawSec)}
        __m := NewMaster(__sec, __wl, ${maxG})
        __t0 := time.Now()
        func() {
            defer func() {
                if r := recover(); r != nil {
                    fmt.Println("ERROR:", r)
                }
            }()
            ${fnName}(__wl, __m)
        }()
        __dt := time.Since(__t0).Nanoseconds()
        fmt.Println(":::TIME:::" + strconv.FormatInt(__dt, 10))
        for __k := range __m.history {
            fmt.Printf("guess #%d: %s -> %d\\n", __k+1, __m.history[__k], __m.scores[__k])
        }
        __tr := "failed:" + strconv.Itoa(__m.guessCount)
        if __m.solved && __m.guessCount <= ${maxG} {
            __tr = "solved:" + strconv.Itoa(__m.guessCount)
        }
        fmt.Println(":::RESULT:::" + __tr)
        fmt.Println("---")
    }`;
        })
        .join("\n        ");

    return `package main

${goImports}
${goListNodeClass}

${goTreeNodeClass}

${goGraphNodeClass}

${goHelperMethods}

${goMasterClass}

func main() {
    ${calls}
}
`;
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
                        let strVal: string;
                        if (Array.isArray(val)) {
                            try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
                        } else {
                            strVal = String(val ?? "[]");
                        }
                        decls.push(`${varName} := toGraphNode(${goEscapeStringLiteral(strVal)})`);
                        args.push(varName);
                    } else {
                        args.push(goGetFullParam([p], tc));
                    }
                });
                const graphNodeArg = args.find((_, i) => params[i]?.type === 'graph_node')!;
                return `{
        ${decls.join('\n        ')}
        __t0 := time.Now()
        res := ${fnName}(${args.join(', ')})
        __dt := time.Since(__t0).Nanoseconds()
        fmt.Println(":::TIME:::" + strconv.FormatInt(__dt, 10))
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
        __t0 := time.Now()
        res := ${fnName}(${args})
        __dt := time.Since(__t0).Nanoseconds()
        fmt.Println(":::TIME:::" + strconv.FormatInt(__dt, 10))
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

export const goGuessGameClass = `
type GuessGame struct {
    pick int
    callCount int
    history []int
    scores []int
}

func NewGuessGame(pick int) *GuessGame {
    return &GuessGame{pick: pick}
}

func (g *GuessGame) Guess(num int) int {
    g.callCount++
    g.history = append(g.history, num)
    var res int
    if num > g.pick {
        res = -1
    } else if num < g.pick {
        res = 1
    } else {
        res = 0
    }
    g.scores = append(g.scores, res)
    return res
}
`;

export const goVersionControlClass = `
type VersionControl struct {
    bad int
    callCount int
    history []int
    scores []bool
}

func NewVersionControl(bad int) *VersionControl {
    return &VersionControl{bad: bad}
}

func (v *VersionControl) IsBadVersion(version int) bool {
    v.callCount++
    v.history = append(v.history, version)
    res := version >= v.bad
    v.scores = append(v.scores, res)
    return res
}
`;

export const goArrayReaderClass = `
type ArrayReader struct {
    arr []int
    callCount int
}

func NewArrayReader(arr []int) *ArrayReader {
    return &ArrayReader{arr: arr}
}

func (r *ArrayReader) Get(index int) int {
    r.callCount++
    if index < 0 || index >= len(r.arr) {
        return 2147483647
    }
    return r.arr[index]
}
`;

export const goMountainArrayClass = `
type MountainArray struct {
    arr []int
    callCount int
}

func NewMountainArray(arr []int) *MountainArray {
    return &MountainArray{arr: arr}
}

func (m *MountainArray) Get(index int) int {
    m.callCount++
    return m.arr[index]
}

func (m *MountainArray) Length() int {
    return len(m.arr)
}
`;

export const goRelationClass = `
type Relation struct {
    graph [][]int
    callCount int
}

func NewRelation(graph [][]int) *Relation {
    return &Relation{graph: graph}
}

func (r *Relation) Knows(a int, b int) bool {
    r.callCount++
    return r.graph[a][b] == 1
}

func (r *Relation) Size() int {
    return len(r.graph)
}
`;

export function goJudgeClass(kind: string): string {
    switch (kind) {
        case 'guess-word': return goMasterClass;
        case 'guess-number': return goGuessGameClass;
        case 'first-bad': return goVersionControlClass;
        case 'array-reader': return goArrayReaderClass;
        case 'mountain-array': return goMountainArrayClass;
        case 'celebrity': return goRelationClass;
        default: throw new Error(`Unknown interactive kind: ${kind}`);
    }
}

function goJudgeSetup(tc: any, idx: number, interactive: InteractiveConfig): { decls: string; call: string; counter: string; history: string } {
    const kind = interactive.kind;
    const secretField = interactive.secretField;
    const arrStr = (field: string) => {
        const raw = tc[field];
        if (Array.isArray(raw)) { try { return JSON.stringify(raw); } catch { return '[]'; } }
        return String(raw ?? '[]');
    };
    if (kind === 'guess-number') {
        return {
            decls: `__n := ${tc['n']}\n__g := NewGuessGame(${tc[secretField]})`,
            call: `__FN__(__n, __g)`,
            counter: `__g.callCount`,
            history: `for __k := range __g.history {\nfmt.Printf("guess #%d: %d -> %d\\n", __k+1, __g.history[__k], __g.scores[__k])\n}`,
        };
    }
    if (kind === 'first-bad') {
        return {
            decls: `__n := ${tc['n']}\n__vc := NewVersionControl(${tc[secretField]})`,
            call: `__FN__(__n, __vc)`,
            counter: `__vc.callCount`,
            history: `for __k := range __vc.history {\nfmt.Printf("check #%d: %d -> %t\\n", __k+1, __vc.history[__k], __vc.scores[__k])\n}`,
        };
    }
    if (kind === 'array-reader') {
        return {
            decls: `__r := NewArrayReader(toIntArray(${goEscapeStringLiteral(arrStr(secretField))}))\n__t := ${tc['target']}`,
            call: `__FN__(__r, __t)`,
            counter: `__r.callCount`,
            history: ``,
        };
    }
    if (kind === 'mountain-array') {
        return {
            decls: `__mt := NewMountainArray(toIntArray(${goEscapeStringLiteral(arrStr(secretField))}))\n__t := ${tc['target']}`,
            call: `__FN__(__t, __mt)`,
            counter: `__mt.callCount`,
            history: ``,
        };
    }
    if (kind === 'celebrity') {
        return {
            decls: `__rel := NewRelation(toIntArray2d(${goEscapeStringLiteral(arrStr(secretField))}))\n__n := __rel.Size()`,
            call: `__FN__(__n, __rel)`,
            counter: `__rel.callCount`,
            history: ``,
        };
    }
    throw new Error(`Unknown interactive kind: ${kind}`);
}

export function generateGoJudgeRunner(
    functionName: string,
    testCases: any[],
    interactive: InteractiveConfig,
): string {
    const fnName = goFunctionName(functionName);
    const calls = testCases
        .map((tc, caseIndex) => {
            const budget = interactiveBudget(interactive, tc);
            const setup = goJudgeSetup(tc, caseIndex, interactive);
            const call = setup.call.replace('__FN__', fnName);
            const hist = setup.history ? `\n${setup.history}` : '';
            return `{
        ${setup.decls.split('\n').join('\n        ')}
        __t0 := time.Now()
        __res := 0
        __ok := true
        func() {
            defer func() {
                if r := recover(); r != nil {
                    fmt.Println("ERROR:", r)
                    __ok = false
                }
            }()
            __res = ${call}
        }()
        __dt := time.Since(__t0).Nanoseconds()
        fmt.Println(":::TIME:::" + strconv.FormatInt(__dt, 10))${hist}
        __calls := ${setup.counter}
        fmt.Printf("api calls: %d (budget ${budget})\\n", __calls)
        __tr := "error"
        if __ok {
            if __calls > ${budget} {
                __tr = "over-budget:" + strconv.Itoa(__calls)
            } else {
                __tr = displayOutput(__res)
            }
        }
        fmt.Println(":::RESULT:::" + __tr)
        fmt.Println("---")
    }`;
        })
        .join("\n        ");

    return `package main

${goImports}
${goListNodeClass}

${goTreeNodeClass}

${goGraphNodeClass}

${goHelperMethods}

${goJudgeClass(interactive.kind)}

func main() {
    ${calls}
}
`;
}
