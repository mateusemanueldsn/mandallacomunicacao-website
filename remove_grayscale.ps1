$path = "c:\Users\emanu\OneDrive\Documentos\Site Mandalla\mandalla\estilizado"
$files = Get-ChildItem -Path $path -Filter "*.html" -Recurse
foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $original = $content

        # Update logos with filter: grayscale(100%) contrast(100%);
        $content = [regex]::Replace($content, '(<img[^>]*logo\.svg[^>]*?)\s*style="filter:\s*grayscale\(100%\)\s*contrast\(100%\);?"', '$1')
        
        # Update logos with height: 40px; filter: grayscale(100%); margin-bottom: 1rem;
        $content = [regex]::Replace($content, '(<img[^>]*logo\.svg[^>]*?)\s*filter:\s*grayscale\(100%\);\s*', '$1')

        # Also cover the simbolyca logo
        $content = [regex]::Replace($content, '(<img[^>]*simbolyca_logo\.svg[^>]*?)\s*style="filter:\s*grayscale\(100%\)\s*contrast\(100%\);?"', '$1')
        $content = [regex]::Replace($content, '(<img[^>]*simbolyca_logo\.svg[^>]*?)\s*filter:\s*grayscale\(100%\);\s*', '$1')
        
        # For multiline variations, a more general approach:
        # If it's an img tag that contains "logo.svg", remove grayscale
        $content = [regex]::Replace($content, '(?si)(<img[^>]*?logo\.svg[^>]*?)(?:style="filter:\s*grayscale\(100%\)\s*contrast\(100%\);?")', '$1')
        $content = [regex]::Replace($content, '(?si)(<img[^>]*?logo\.svg[^>]*?)(filter:\s*grayscale\(100%\);\s*)', '$1')

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
