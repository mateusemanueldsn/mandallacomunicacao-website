Add-Type -AssemblyName System.Drawing

function Expand-ImageTo16x9Right {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )

    # Ler bytes primeiro para liberar o arquivo completamente
    $bytes    = [System.IO.File]::ReadAllBytes($InputPath)
    $ms       = New-Object System.IO.MemoryStream(,$bytes)
    $original = [System.Drawing.Image]::FromStream($ms)

    $origWidth  = $original.Width
    $origHeight = $original.Height

    # Canvas 16:9 baseado na altura original
    $newWidth  = [int]($origHeight * 16.0 / 9.0)
    $newHeight = $origHeight

    # Se a foto já for mais larga que o canvas 16:9, recalcula pela largura
    if ($origWidth -gt $newWidth) {
        $newWidth  = $origWidth
        $newHeight = [int]($origWidth * 9.0 / 16.0)
    }

    $canvas = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $g      = [System.Drawing.Graphics]::FromImage($canvas)

    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fundo branco
    $g.Clear([System.Drawing.Color]::White)

    # Foto ancorada no lado DIREITO, centralizada verticalmente
    $xOffset  = $newWidth - $origWidth
    $yOffset  = [int](($newHeight - $origHeight) / 2)
    $destRect = New-Object System.Drawing.Rectangle($xOffset, $yOffset, $origWidth, $origHeight)
    $g.DrawImage($original, $destRect)

    # Salvar em memória e depois gravar no disco (evita GDI+ lock)
    $outMs = New-Object System.IO.MemoryStream
    $canvas.Save($outMs, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $canvas.Dispose()
    $original.Dispose()
    $ms.Dispose()

    [System.IO.File]::WriteAllBytes($OutputPath, $outMs.ToArray())
    $outMs.Dispose()

    Write-Host "Salvo: $OutputPath  ($($newWidth) x $($newHeight) px)"
}

$base = "C:\Users\emanu\OneDrive\Documentos\Site Mandalla\mandalla\estilizado\assets"

Expand-ImageTo16x9Right -InputPath "$base\hero_impacto.png"  -OutputPath "$base\hero_impacto.png"
Expand-ImageTo16x9Right -InputPath "$base\hero_mentoria.png" -OutputPath "$base\hero_mentoria.png"

Write-Host "`nPronto! Imagens expandidas para 16:9 com fundo branco a esquerda."
