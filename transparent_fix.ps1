Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("c:\laragon\www\bisnis\images\cake.png")
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        $alpha = [math]::Floor(($p.R + $p.G + $p.B) / 3)
        $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
    }
}
$newBmp.Save("c:\laragon\www\bisnis\images\cake_transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
