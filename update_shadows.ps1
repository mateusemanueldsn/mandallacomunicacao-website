$path = "c:\Users\emanu\OneDrive\Documentos\Site Mandalla\mandalla\estilizado"
$files = Get-ChildItem -Path $path -Filter "*.html" -Recurse

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $original = $content

        # Replace hard bruteforce black box-shadows in inline styles
        # Pattern: box-shadow: Npx Npx 0px #000
        $content = [regex]::Replace($content, 'box-shadow:\s*\d+px\s+\d+px\s+0px\s+#000\b[0-9a-fA-F]*;', 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);')
        $content = [regex]::Replace($content, 'box-shadow:\s*\d+px\s+\d+px\s+0px\s+#000000;', 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);')

        # border-radius: 0px or border-radius: 0; -> 16px (only in style= attributes, not in CSS classes already handled)
        $content = [regex]::Replace($content, '(style="[^"]*?)border-radius:\s*0(?:px)?;', '$1border-radius: 16px;')

        # Hard border: X solid #000 in inline styles -> remove or soften (keep structural ones)
        # Only target inline card/box elements: keep header nav borders as-is
        # Replace border: Npx solid #000 when inside padding-heavy divs (cards)
        $content = [regex]::Replace($content, '(style="[^"]*?)(border:\s*\d+(?:\.\d+)?px solid #000(?:000)?;)', '$1border: none;')

        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Updated: $($file.Name)"
        }
    }
    catch {
        Write-Error "Failed: $($file.Name)"
    }
}
Write-Host "Done!"
