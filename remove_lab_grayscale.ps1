$path = "c:\Users\emanu\OneDrive\Documentos\Site Mandalla\mandalla\estilizado"
$files = Get-ChildItem -Path $path -Filter "*.html" -Recurse

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $original = $content

        # Remove filter: grayscale(100%); from .lab-logo { ... }
        $content = [regex]::Replace($content, '(\.lab-logo\s*\{[^}]*?)filter:\s*grayscale\(100%\);([^}]*\})', '$1$2')

        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Updated $($file.FullName)"
        }
    }
    catch {
        Write-Error "Failed to process $($file.Name)"
    }
}
Write-Host "Done!"
