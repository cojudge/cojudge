package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"
)

const STATE_FILE = "/tmp/cojudge_debug_state.json"
const CMD_FILE = "/tmp/cojudge_debug_cmd.json"

var dlvAddr string
var outputBuffer bytes.Buffer
var outputMu sync.Mutex

func findFreePort() (string, error) {
	l, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return "", err
	}
	addr := l.Addr().String()
	l.Close()
	return addr, nil
}

type rpcRequest struct {
	Method string        `json:"method"`
	Params []interface{} `json:"params"`
	ID     int           `json:"id"`
}

type rpcResponse struct {
	ID     int             `json:"id"`
	Result json.RawMessage `json:"result"`
	Error  interface{}     `json:"error"`
}

func rpcCall(method string, params interface{}) (json.RawMessage, error) {
	conn, err := net.DialTimeout("tcp", dlvAddr, 5*time.Second)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	reqBody := rpcRequest{
		Method: method,
		Params: []interface{}{params},
		ID:     1,
	}
	data, _ := json.Marshal(reqBody)
	if _, err := conn.Write(data); err != nil {
		return nil, err
	}

	var buf bytes.Buffer
	tmp := make([]byte, 4096)
	conn.SetReadDeadline(time.Now().Add(30 * time.Second))
	for {
		n, err := conn.Read(tmp)
		if n > 0 {
			buf.Write(tmp[:n])
		}
		if err != nil {
			if err == io.EOF {
				break
			}
			return nil, err
		}
		if json.Valid(buf.Bytes()) {
			break
		}
	}
	var r rpcResponse
	if err := json.Unmarshal(buf.Bytes(), &r); err != nil {
		return nil, err
	}
	if r.Error != nil {
		return nil, fmt.Errorf("RPC error: %v", r.Error)
	}
	return r.Result, nil
}

type dlvState struct {
	Exited bool   `json:"-"`
	State  struct {
		Exited        bool   `json:"Exited"`
		ExitStatus    int    `json:"ExitStatus"`
		Running       bool   `json:"Running"`
		CurrentThread *struct {
			File string `json:"File"`
			Line int    `json:"Line"`
		} `json:"CurrentThread"`
	} `json:"State"`
}

func getState() (*dlvState, error) {
	raw, err := rpcCall("RPCServer.State", map[string]interface{}{
		"NonBlocking": true,
	})
	if err != nil {
		if strings.Contains(err.Error(), "exited") || strings.Contains(err.Error(), "has exited") {
			return &dlvState{Exited: true}, nil
		}
		return nil, err
	}
	if string(raw) == "null" {
		return &dlvState{Exited: true}, nil
	}
	var s dlvState
	if err := json.Unmarshal(raw, &s); err != nil {
		return nil, err
	}
	return &s, nil
}

func waitForPause() (*dlvState, error) {
	for {
		s, err := getState()
		if err != nil {
			time.Sleep(200 * time.Millisecond)
			continue
		}
		if s.Exited || s.State.Exited {
			return s, nil
		}
		if !s.State.Running && s.State.CurrentThread != nil {
			return s, nil
		}
		time.Sleep(150 * time.Millisecond)
	}
}

func readCommand() (map[string]interface{}, error) {
	for {
		data, err := os.ReadFile(CMD_FILE)
		if err == nil && len(data) > 0 {
			data = bytes.TrimSpace(data)
			if len(data) == 0 {
				time.Sleep(100 * time.Millisecond)
				continue
			}
			var cmd map[string]interface{}
			if err := json.Unmarshal(data, &cmd); err == nil {
				os.Remove(CMD_FILE)
				return cmd, nil
			}
		}
		time.Sleep(100 * time.Millisecond)
	}
}

func hasCommand() bool {
	_, err := os.Stat(CMD_FILE)
	return err == nil
}

func writeState(status string, line int, vars map[string]string, errMsg string) {
	state := map[string]interface{}{
		"status": status,
	}
	if line > 0 {
		state["line"] = line
	}
	if vars != nil && len(vars) > 0 {
		state["vars"] = vars
	}
	outputMu.Lock()
	out := outputBuffer.String()
	outputMu.Unlock()
	state["output"] = out
	if errMsg != "" {
		state["error"] = errMsg
	}
	data, _ := json.Marshal(state)
	os.WriteFile(STATE_FILE, data, 0644)
}

type dlvVariable struct {
	Name       string         `json:"name"`
	Value      string         `json:"value"`
	Type       string         `json:"type"`
	Len        int64          `json:"len"`
	Unreadable string         `json:"unreadable"`
	Children   []dlvVariable  `json:"children"`
}

func renderVar(v dlvVariable, depth int) string {
	if v.Unreadable != "" {
		return "<" + v.Unreadable + ">"
	}
	if depth > 2 {
		return "[...]"
	}
	if len(v.Children) > 0 {
		maxShow := 100
		parts := make([]string, 0, len(v.Children))
		for i, child := range v.Children {
			if i >= maxShow {
				parts = append(parts, "...")
				break
			}
			if v.Type == "string" {
				parts = append(parts, "\""+child.Value+"\"")
			} else {
				parts = append(parts, renderVar(child, depth+1))
			}
		}
		switch {
		case strings.HasPrefix(v.Type, "[]"):
			return "[" + strings.Join(parts, ", ") + "]"
		case strings.HasPrefix(v.Type, "map["):
			return "map[" + strings.Join(parts, ", ") + "]"
		default:
			return "{" + strings.Join(parts, ", ") + "}"
		}
	}
	return v.Value
}

func collectVars() map[string]string {
	vars := make(map[string]string)

	scope := map[string]interface{}{
		"GoroutineID": -1,
		"Frame":       0,
	}
	cfg := map[string]interface{}{
		"FollowPointers":    true,
		"MaxVariableRecurse": 2,
		"MaxArrayValues":    100,
		"MaxStringLen":      200,
		"MaxStructFields":   -1,
	}

	locResult, err := rpcCall("RPCServer.ListLocalVars", map[string]interface{}{
		"Scope": scope,
		"Cfg":   cfg,
	})
	if err != nil {
	} else {
		var lv struct {
			Variables []dlvVariable `json:"Variables"`
		}
		if err := json.Unmarshal(locResult, &lv); err != nil {
		} else {
			for _, v := range lv.Variables {
				if len(v.Name) > 0 && v.Name[0] != '_' && v.Name[0] != '~' {
					vars[v.Name] = renderVar(v, 0)
				}
			}
		}
	}

	argResult, err := rpcCall("RPCServer.ListFunctionArgs", map[string]interface{}{
		"Scope": scope,
		"Cfg":   cfg,
	})
	if err != nil {
	} else {
		var fa struct {
			Args []dlvVariable `json:"Args"`
		}
		if err := json.Unmarshal(argResult, &fa); err != nil {
		} else {
			for _, a := range fa.Args {
				if len(a.Name) > 0 && a.Name[0] != '_' && a.Name[0] != '~' {
					if _, exists := vars[a.Name]; !exists {
						vars[a.Name] = renderVar(a, 0)
					}
				}
			}
		}
	}

	return vars
}

func createBreakpoints(sourceFile string, lines []int) {
	for _, line := range lines {
		rpcCall("RPCServer.CreateBreakpoint", map[string]interface{}{
			"Breakpoint": map[string]interface{}{
				"file": sourceFile,
				"line": line,
			},
		})
	}
}

func clearAllBreakpoints() {
	listResult, err := rpcCall("RPCServer.ListBreakpoints", map[string]interface{}{})
	if err != nil {
		return
	}
	var bl struct {
		Breakpoints []struct {
			ID int `json:"id"`
		} `json:"Breakpoints"`
	}
	if json.Unmarshal(listResult, &bl) != nil {
		return
	}
	for _, bp := range bl.Breakpoints {
		rpcCall("RPCServer.ClearBreakpoint", map[string]interface{}{
			"Id": bp.ID,
		})
	}
}

func parseIntList(raw interface{}) []int {
	var result []int
	switch v := raw.(type) {
	case []interface{}:
		for _, item := range v {
			switch n := item.(type) {
			case float64:
				result = append(result, int(n))
			case int:
				result = append(result, n)
			}
		}
	}
	return result
}

func main() {
	if len(os.Args) < 4 {
		fmt.Fprintf(os.Stderr, "Usage: go_debug_driver <source_file> <breakpoints> <binary>\n")
		os.Exit(1)
	}

	sourceFile := os.Args[1]
	bpStr := os.Args[2]
	binary := os.Args[3]

	breakpoints := []int{}
	for _, s := range strings.Split(bpStr, ",") {
		s = strings.TrimSpace(s)
		if n, err := strconv.Atoi(s); err == nil {
			breakpoints = append(breakpoints, n)
		}
	}

	writeState("running", 0, nil, "")

	addr, err := findFreePort()
	if err != nil {
		writeState("error", 0, nil, "Failed to find free port: "+err.Error())
		os.Exit(1)
	}
	dlvAddr = addr

	cmd := exec.Command("dlv", "exec", "--headless", "--api-version=2",
		"--listen="+dlvAddr, "--accept-multiclient", binary)

	stdoutPipe, _ := cmd.StdoutPipe()
	stderrPipe, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		writeState("error", 0, nil, "Failed to start dlv: "+err.Error())
		os.Exit(1)
	}

	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stdoutPipe.Read(buf)
			if n > 0 {
				s := string(buf[:n])
				if !strings.HasPrefix(s, "API server listening at:") {
					outputMu.Lock()
					outputBuffer.WriteString(s)
					outputMu.Unlock()
				}
			}
			if err != nil {
				break
			}
		}
	}()
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := stderrPipe.Read(buf)
			if n > 0 {
				outputMu.Lock()
				outputBuffer.WriteString(string(buf[:n]))
				outputMu.Unlock()
			}
			if err != nil {
				break
			}
		}
	}()

	time.Sleep(300 * time.Millisecond)

	// Retry connecting to dlv until it's ready
	for i := 0; i < 20; i++ {
		_, err := rpcCall("RPCServer.State", map[string]interface{}{
			"NonBlocking": true,
		})
		if err == nil {
			break
		}
		if i == 19 {
			writeState("error", 0, nil, "Failed to connect to dlv after multiple retries")
			cmd.Process.Kill()
			os.Exit(1)
		}
		time.Sleep(200 * time.Millisecond)
	}

	createBreakpoints(sourceFile, breakpoints)

	rpcCall("RPCServer.Command", map[string]interface{}{
		"name": "continue",
	})

	exited := false
	for !exited {
		s, err := waitForPause()
		if err != nil {
			time.Sleep(200 * time.Millisecond)
			continue
		}

		if s.Exited || s.State.Exited {
			if s.State.ExitStatus != 0 {
				msg := fmt.Sprintf("Process exited with status %d", s.State.ExitStatus)
				writeState("error", 0, nil, msg)
			} else {
				writeState("completed", 0, nil, "")
			}
			cmd.Process.Kill()
			exited = true
			continue
		}

		if s.State.CurrentThread == nil {
			writeState("completed", 0, nil, "")
			cmd.Process.Kill()
			exited = true
			continue
		}

		line := s.State.CurrentThread.Line
		vars := collectVars()
		writeState("paused", line, vars, "")

		for {
			cmdMap, err := readCommand()
			if err != nil {
				continue
			}

			action, _ := cmdMap["action"].(string)

			switch action {
			case "stop":
				rpcCall("RPCServer.Command", map[string]interface{}{
					"name": "halt",
				})
				time.Sleep(100 * time.Millisecond)
				writeState("stopped", 0, nil, "")
				cmd.Process.Kill()
				exited = true

			case "continue":
				rpcCall("RPCServer.Command", map[string]interface{}{
					"name": "continue",
				})

			case "step":
				rpcCall("RPCServer.Command", map[string]interface{}{
					"name": "next",
				})

			case "set_breakpoints":
				clearAllBreakpoints()
				newBps := parseIntList(cmdMap["breakpoints"])
				createBreakpoints(sourceFile, newBps)
				vars := collectVars()
				writeState("paused", line, vars, "")
				continue
			}

			if action == "continue" || action == "step" {
				break
			}
			if action == "stop" {
				break
			}
		}

		if exited {
			break
		}
	}

	cmd.Wait()
}
