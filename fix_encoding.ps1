$file = 'c:\Users\mateu\OneDrive\Documentos\Site Mandalla\mandalla\lab\universo-marcas.html'
$bytes = [System.IO.File]::ReadAllBytes($file)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$fixes = @{
    'Ã§Ã£o' = [char]231 + [char]227 + 'o'
    'Ã§Ã£' = [char]231 + [char]227
    'Ã©' = [char]233
    'Ãª' = [char]234
    'Ã­' = [char]237
    'Ã³' = [char]243
    'Ã´' = [char]244
    'Ãµ' = [char]245
    'Ã¼' = [char]252
    'Ã£' = [char]227
    'Ã¡' = [char]225
    'Ã ' = [char]224
    'Ãº' = [char]250
    'Ã§' = [char]231
    'Ã‰' = [char]201
    'Ã‡' = [char]199
    'â€"' = [char]8212
    'â€œ' = [char]8220
    'â€' = [char]8221
    'Ã±' = [char]241
}
foreach ($key in $fixes.Keys) {
    $content = $content.Replace($key, $fixes[$key])
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $content, $utf8NoBom)
Write-Host 'Done'
