
Add-Type -AssemblyName System.Drawing

$source = "assets\images\reveda_logo.png"
$dest = "assets\images\reveda_logo_final.png"

try {
    Write-Host "Loading image from $source..."
    $img = [System.Drawing.Image]::FromFile($source)
    Write-Host "Saving as PNG to $dest..."
    $img.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    Write-Host "Conversion complete."
} catch {
    Write-Error "Failed to convert image: $_"
    exit 1
}
