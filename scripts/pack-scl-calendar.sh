#!/usr/bin/env bash
set -euo pipefail

output_dir="${1:-dist/scl-calendar}"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$output_dir"
output_dir="$(cd "$output_dir" && pwd)"

cd "$repo_root"
pnpm --filter emdash build
pnpm --filter @emdash-cms/cloudflare build

pack() {
	local package_dir="$1"
	local output_name="$2"
	local packed
	packed="$(cd "$package_dir" && pnpm pack --pack-destination "$output_dir" | tail -n 1)"
	mv "$packed" "$output_dir/$output_name"
}

pack packages/core emdash-0.35.0-scl.1.tgz
pack packages/cloudflare emdash-cms-cloudflare-0.35.0-scl.1.tgz
