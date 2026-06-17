$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$messagePath = Join-Path $repoRoot "commit-msg.txt"

if (-not (Test-Path $messagePath)) {
  Write-Error "commit-msg.txt not found at repository root."
}

# Ensure UTF-8 settings for this process
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

# Validate commit message file encoding/content
$raw = [System.IO.File]::ReadAllText($messagePath, [System.Text.UTF8Encoding]::new($false, $true))
if ([string]::IsNullOrWhiteSpace($raw)) {
  Write-Error "commit-msg.txt is empty."
}
if ($raw.Contains([char]0xFFFD)) {
  Write-Error "commit-msg.txt includes replacement character (U+FFFD). Re-save as UTF-8 in editor."
}

# Enforce UTF-8 log/commit encoding for local repository
git -C $repoRoot config i18n.commitEncoding utf-8 | Out-Null
git -C $repoRoot config i18n.logOutputEncoding utf-8 | Out-Null

git -C $repoRoot commit -F $messagePath
