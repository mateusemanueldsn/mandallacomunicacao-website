$file = 'c:\Users\mateu\OneDrive\Documentos\Site Mandalla\mandalla\lab\universo-marcas.html'
$lines = Get-Content $file
# Keep lines 0..470 (index 0-based = lines 1-471), then skip to line 574 onwards (index 573)
$clean = $lines[0..470] + $lines[573..($lines.Length-1)]
$clean | Set-Content $file -Encoding UTF8
Write-Host "Done. File saved."
