#!/usr/bin/env bash
# Starts any Metal Werx server that isn't listening on its port.
# Run from cron at boot and every few minutes (see `crontab -l`).
set -u

# Node is installed with nvm, which cron's PATH doesn't include.
export PATH="$HOME/.nvm/versions/node/v24.22.0/bin:$HOME/.local/bin:/usr/bin:/bin"
LOG_DIR="$HOME/.local/state/metalwerx"
mkdir -p "$LOG_DIR"

# One run at a time, so a slow start isn't launched twice.
exec 9>"$LOG_DIR/keepalive.lock"
flock -n 9 || exit 0

listening() { ss -Hltn "sport = :$1" | grep -q .; }

# ensure PORT DIR LOG COMMAND...
ensure() {
  local port=$1 dir=$2 log=$3; shift 3
  listening "$port" && return 0
  echo "$(date -Is) :$port is down, starting $*" >> "$LOG_DIR/keepalive.log"
  # 9>&-: the server (and the subshell waiting on it) mustn't inherit the lock,
  # or later runs would never get it.
  (cd "$dir" && setsid nohup "$@" >> "$log" 2>&1 < /dev/null &) 9>&-
  for _ in $(seq 60); do
    listening "$port" && return 0
    sleep 1
  done
  echo "$(date -Is) :$port still down after 60s, see $log" >> "$LOG_DIR/keepalive.log"
}

# SeaweedFS S3 (photos for the CMS and the site's image optimizer)
ensure 9000 "$HOME" "$HOME/seaweedfs/weed.log" \
  weed server -dir="$HOME/seaweedfs/data" -ip=127.0.0.1 -ip.bind=127.0.0.1 -filer -s3 \
  -s3.ip.bind=0.0.0.0 -s3.port=9000 -s3.config="$HOME/seaweedfs/s3.json" \
  -s3.port.iceberg=0 -s3.port.lance=0 -master.volumeSizeLimitMB=256 -volume.max=8
# Payload CMS
ensure 3001 "$HOME/metalwerx-project/metalwerx-payload" "$LOG_DIR/cms.log" npm start
# Website
ensure 3000 "$HOME/metalwerx-project/metalwerx" "$LOG_DIR/site.log" npm start
