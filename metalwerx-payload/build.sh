#!/usr/bin/env bash
# Stops the running CMS and any build still going, rebuilds it and starts it again on :3001.
set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")"
export PATH="$HOME/.nvm/versions/node/v24.22.0/bin:$PATH"
NAME=CMS
PORT=3001   # fixed in package.json's start script
LOG_DIR="$HOME/.local/state/metalwerx"
LOG="$LOG_DIR/cms.log"
BUILD_LOG="$LOG_DIR/cms-build.log"
START=$EPOCHSECONDS
mkdir -p "$LOG_DIR"

listening() { ss -Hltn "sport = :$PORT" | grep -q .; }

# draw PERCENT LABEL: redraws the progress bar in place (one line per step when not a terminal).
draw() {
  local pct=$1 label=$2 width=30 filled bar rest elapsed=$((EPOCHSECONDS - START))
  if [[ ! -t 1 ]]; then
    [[ $label != "${LAST_LABEL:-}" ]] && echo "$NAME: $label"
    LAST_LABEL=$label
    return 0
  fi
  filled=$((pct * width / 100))
  printf -v bar '%*s' "$filled" ''
  printf -v rest '%*s' "$((width - filled))" ''
  printf '\r\e[K%s [%s%s] %3d%%  %s  %dm%02ds' "$NAME" "${bar// /█}" "${rest// /░}" "$pct" "$label" \
    $((elapsed / 60)) $((elapsed % 60))
}

fail() { [[ -t 1 ]] && printf '\r\e[K'; echo "$NAME: $*" >&2; exit 1; }

# Moves the bar through `next build`'s stages as it prints them, creeping
# toward the end of the current stage while it's quiet. Tenths of a percent.
build_progress() {
  local line lo=30 hi=50 pct=30 label="Starting build"
  while :; do
    if IFS= read -r -t 1 line; then
      case $line in
        *"Creating an optimized production build"*) lo=50 hi=500 label="Compiling" ;;
        *"Running TypeScript"*) lo=500 hi=650 label="Checking types" ;;
        *"Collecting page data"*) lo=650 hi=750 label="Collecting page data" ;;
        *"Generating static pages"*)
          hi=900 label="Generating pages"
          [[ $line =~ \(([0-9]+)/([0-9]+)\) ]] &&
            lo=$((750 + 150 * BASH_REMATCH[1] / BASH_REMATCH[2])) label="Generating pages ${BASH_REMATCH[1]}/${BASH_REMATCH[2]}" ;;
        *"Finalizing page optimization"*) lo=900 hi=930 label="Finalizing" ;;
        *"Collecting build traces"*) lo=930 hi=950 label="Collecting build traces" ;;
      esac
      ((pct < lo)) && pct=$lo
    elif (($? > 128)); then
      pct=$((pct + (hi - pct) / 30))
    else
      break
    fi
    draw $((pct / 10)) "$label"
  done
}

# Kills each process's whole group (npm, sh, next), TERM first, then KILL.
kill_groups() {
  local pid pgid groups=()
  for pid in "$@"; do
    pgid=$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d ' ') || continue
    [[ -n $pgid && $pgid -gt 1 && $pgid != "$(ps -o pgid= -p $$ | tr -d ' ')" ]] && groups+=("$pgid")
  done
  [[ ${#groups[@]} -eq 0 ]] && return 0
  for pgid in $(printf '%s\n' "${groups[@]}" | sort -u); do
    kill -TERM -- "-$pgid" 2>/dev/null || true
  done
  for _ in $(seq 10); do
    local alive=0
    for pgid in "${groups[@]}"; do kill -0 -- "-$pgid" 2>/dev/null && alive=1; done
    [[ $alive -eq 0 ]] && return 0
    sleep 1
  done
  for pgid in "${groups[@]}"; do kill -KILL -- "-$pgid" 2>/dev/null || true; done
}

# A previous `next build` in this folder (and the build.sh that started it).
draw 0 "Stopping previous build"
build_pids=()
for pid in $(pgrep -f 'next build' || true); do
  [[ $(readlink "/proc/$pid/cwd" 2>/dev/null) == "$PWD" ]] && build_pids+=("$pid")
done
kill_groups "${build_pids[@]}"

# Hold keepalive.sh's lock so its cron run doesn't restart the old build mid-way.
draw 1 "Waiting for keepalive.sh"
exec 9>"$LOG_DIR/keepalive.lock"
flock -w 180 9 || fail "keepalive.sh is holding its lock; try again"

# The running server.
draw 2 "Stopping server"
kill_groups $(ss -Hltnp "sport = :$PORT" | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u)

set +e
npm run build 2>&1 | tee "$BUILD_LOG" | build_progress
status=${PIPESTATUS[0]}
set -e
if [[ $status -ne 0 ]]; then
  [[ -t 1 ]] && printf '\r\e[K'
  tail -n 30 "$BUILD_LOG" >&2
  fail "build failed, full output in $BUILD_LOG"
fi

draw 95 "Starting server"
# 9>&-: the server mustn't inherit the lock, or keepalive.sh would never get it.
(setsid nohup npm start >> "$LOG" 2>&1 < /dev/null 9>&- &)
for i in $(seq 60); do
  if listening; then
    draw 100 "Up at http://192.168.15.240:$PORT"
    echo
    exit 0
  fi
  draw $((95 + i * 5 / 60)) "Starting server"
  sleep 1
done
fail "still down after 60s, see $LOG"
