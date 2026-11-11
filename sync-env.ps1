# .env 의 GROQ_API_KEY 를 config.js 로 반영합니다.
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $root ".env"
$outPath = Join-Path $root "config.js"

if (-not (Test-Path -LiteralPath $envPath)) {
  Write-Error ".env 파일이 없습니다. .env.example 을 복사해 .env 를 만든 뒤 키를 넣어 주세요."
  exit 1
}

$key = $null
Get-Content -LiteralPath $envPath -Encoding UTF8 | ForEach-Object {
  $line = $_.Trim()
  if ($line -match '^\s*#' -or $line -eq "") { return }
  if ($line -match '^\s*GROQ_API_KEY\s*=\s*(.*)$') {
    $key = $Matches[1].Trim().Trim('"').Trim("'")
  }
}

if ([string]::IsNullOrWhiteSpace($key)) {
  Write-Error ".env 에서 GROQ_API_KEY 를 찾지 못했습니다."
  exit 1
}

$escaped = $key.Replace('\', '\\').Replace('"', '\"')
$content = @"
// .env 의 GROQ_API_KEY 를 브라우저에서 쓰기 위한 설정 파일입니다.
// GitHub에 올리지 마세요. (.gitignore에 포함됨)
// 생성: sync-env.ps1
window.__ENV__ = window.__ENV__ || {};
window.__ENV__.GROQ_API_KEY = "$escaped";
"@

[System.IO.File]::WriteAllText($outPath, $content.TrimEnd() + "`n", [System.Text.UTF8Encoding]::new($false))
Write-Host "config.js 를 .env 기준으로 갱신했습니다."
