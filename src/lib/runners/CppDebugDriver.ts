export const CPP_DEBUG_DRIVER: string = String.raw`#!/usr/bin/env python3
import subprocess
import json
import os
import sys
import re
import time

STATE_FILE = '/tmp/cojudge_debug_state.json'
CMD_FILE = '/tmp/cojudge_debug_cmd.json'
STDOUT_FILE = '/tmp/cojudge_stdout.txt'

def send_mi(gdb_proc, cmd):
    gdb_proc.stdin.write(cmd + '\n')
    gdb_proc.stdin.flush()

def read_mi_until(gdb_proc, sentinel='(gdb)'):
    lines = []
    while True:
        line = gdb_proc.stdout.readline()
        if line == '':
            break
        line = line.strip()
        if line == sentinel:
            break
        lines.append(line)
    return lines

def read_output():
    try:
        with open(STDOUT_FILE, 'r') as f:
            content = f.read()
        lines = content.split('\n')
        filtered = [l for l in lines if not l.startswith('&"')]
        return '\n'.join(filtered)
    except:
        return ''

def handle_exit_reason(data, gdb_proc):
    reason_match = re.search(r'reason="([^"]*)"', data)
    reason = reason_match.group(1) if reason_match else 'exited'

    output = read_output()
    if reason in ('exited-normally', 'exited'):
        exit_code_match = re.search(r'exit-code="(\d+)"', data)
        exit_code = exit_code_match.group(1) if exit_code_match else '0'
        status = 'completed'
        state = {'status': status, 'output': output}
        if exit_code != '0':
            state['status'] = 'error'
            state['error'] = 'Process exited with code ' + exit_code
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
        send_mi(gdb_proc, '-gdb-exit')
        return True
    elif reason == 'signal-received':
        sig_match = re.search(r'signal-name="([^"]*)"', data)
        sig_name = sig_match.group(1) if sig_match else 'unknown'
        sig_meaning_match = re.search(r'signal-meaning="([^"]*)"', data)
        sig_meaning = sig_meaning_match.group(1) if sig_meaning_match else sig_name
        state = {'status': 'error', 'error': sig_meaning, 'output': output}
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
        send_mi(gdb_proc, '-gdb-exit')
        return True
    return False

def extract_all_vars(lines):
    vars_dict = {}
    for record in lines:
        if record.startswith('^done,variables='):
            for m in re.finditer(r'\{name="([^"]*)",.*?value="((?:[^"\\]|\\.)*)"\}', record):
                name = m.group(1)
                value = m.group(2)
                if name and not name.startswith('_') and name != 'this':
                    vars_dict[name] = value
    return vars_dict

def collect_variables(gdb_proc):
    send_mi(gdb_proc, '-stack-list-variables --all-values')
    resp = read_mi_until(gdb_proc)
    return extract_all_vars(resp)

def wait_for_cmd():
    while True:
        try:
            if os.path.exists(CMD_FILE):
                with open(CMD_FILE, 'r') as f:
                    content = f.read().strip()
                if content:
                    cmd = json.loads(content)
                    os.remove(CMD_FILE)
                    return cmd
        except:
            pass
        time.sleep(0.1)

def update_breakpoints(gdb_proc, source_file, new_bps):
    send_mi(gdb_proc, '-break-delete')
    read_mi_until(gdb_proc)
    for line_no in new_bps:
        send_mi(gdb_proc, '-break-insert ' + source_file + ':' + str(line_no))
        read_mi_until(gdb_proc)

def main():
    if len(sys.argv) < 3:
        print('Usage: cpp_debug_driver.py <source_file> <breakpoints> [binary]', file=sys.stderr)
        sys.exit(1)

    source_file = sys.argv[1]
    bp_str = sys.argv[2]
    binary = sys.argv[3] if len(sys.argv) > 3 else './main'

    breakpoints = []
    for s in bp_str.split(','):
        s = s.strip()
        if s:
            try:
                breakpoints.append(int(s))
            except ValueError:
                pass

    # Create output file for inferior stdout capture
    try:
        with open(STDOUT_FILE, 'w') as f:
            f.write('')
    except:
        pass

    with open(STATE_FILE, 'w') as f:
        json.dump({'status': 'running', 'output': ''}, f)

    gdb_proc = subprocess.Popen(
        ['gdb', '--interpreter=mi', '--quiet', binary],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Consume initial startup output
    read_mi_until(gdb_proc)

    # Enable GDB STL pretty-printers
    send_mi(gdb_proc, '-gdb-set auto-load safe-path /')
    read_mi_until(gdb_proc)

    # Redirect inferior stdout to file
    send_mi(gdb_proc, '-gdb-set inferior-tty ' + STDOUT_FILE)
    read_mi_until(gdb_proc)

    for line_no in breakpoints:
        send_mi(gdb_proc, '-break-insert ' + source_file + ':' + str(line_no))
        read_mi_until(gdb_proc)

    send_mi(gdb_proc, '-exec-run')

    exited = False

    while not exited and gdb_proc.poll() is None:
        lines = read_mi_until(gdb_proc)

        for line in lines:
            if line.startswith('*stopped'):
                if handle_exit_reason(line, gdb_proc):
                    exited = True
                    break

                reason_match = re.search(r'reason="([^"]*)"', line)
                reason = reason_match.group(1) if reason_match else 'unknown'

                if reason in ('breakpoint-hit', 'end-stepping-range', 'function-finished'):
                    line_match = re.search(r'line="(\d+)"', line)
                    line_no = int(line_match.group(1)) if line_match else None

                    vars_dict = collect_variables(gdb_proc)
                    output = read_output()

                    state = {
                        'status': 'paused',
                        'line': line_no,
                        'vars': vars_dict,
                        'output': output
                    }
                    with open(STATE_FILE, 'w') as f:
                        json.dump(state, f)

                    while True:
                        cmd = wait_for_cmd()
                        action = cmd.get('action', '')

                        if action == 'stop':
                            output = read_output()
                            state = {'status': 'stopped', 'output': output}
                            with open(STATE_FILE, 'w') as f:
                                json.dump(state, f)
                            send_mi(gdb_proc, '-gdb-exit')
                            exited = True
                            break
                        elif action == 'step':
                            send_mi(gdb_proc, '-exec-next')
                            break
                        elif action == 'continue':
                            send_mi(gdb_proc, '-exec-continue')
                            break
                        elif action == 'set_breakpoints':
                            new_bps = cmd.get('breakpoints', [])
                            new_bps_int = []
                            for b in new_bps:
                                try:
                                    new_bps_int.append(int(str(b)))
                                except ValueError:
                                    pass
                            update_breakpoints(gdb_proc, source_file, new_bps_int)
                            output = read_output()
                            state['output'] = output
                            with open(STATE_FILE, 'w') as f:
                                json.dump(state, f)
                    if exited:
                        break
            elif line.startswith('&'):
                pass

    try:
        gdb_proc.wait(timeout=5)
    except:
        try:
            gdb_proc.terminate()
        except:
            pass

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        try:
            output = read_output()
            with open(STATE_FILE, 'w') as f:
                json.dump({'status': 'error', 'error': str(e), 'output': output}, f)
        except:
            pass
`;
