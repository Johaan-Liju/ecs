# ---------------------------------------------------------------------------
# Derives every logo asset the site uses from the single file the client
# supplied. Nothing here redraws the logo: it only crops the paper away, keys
# the white to transparent, and scales the result.
#
#   .\scripts\make-logo-assets.ps1 [-Source path\to\new_logo.jpeg]
#
# If a new logo arrives at a different size, re-measure the two crop boxes at
# the bottom of this file before running it.
# ---------------------------------------------------------------------------
param(
  [string]$Source = (Join-Path $PSScriptRoot "..\ecs_logo.jpeg")
)

Add-Type -AssemblyName System.Drawing

$src    = (Resolve-Path $Source).Path
$root   = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$pubDir = Join-Path $root "public"
$outDir = Join-Path $pubDir "assets"

# ---- read source into a byte buffer -----------------------------------------
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$W = $bmp.Width; $H = $bmp.Height
$rect = New-Object System.Drawing.Rectangle 0,0,$W,$H
$d = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $d.Stride
$buf = New-Object byte[] ($stride * $H)
[System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $buf, 0, $buf.Length)
$bmp.UnlockBits($d)
$bmp.Dispose()

# ---- crop + key white to transparent ----------------------------------------
# Keeps every ink pixel exactly as supplied; only the paper is removed.
# Edge pixels are un-composited off white so they stay the true ink colour.
function New-Keyed([int]$x0, [int]$y0, [int]$cw, [int]$ch, [bool]$silhouette) {
  $out = New-Object System.Drawing.Bitmap $cw, $ch, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $r2 = New-Object System.Drawing.Rectangle 0,0,$cw,$ch
  $od = $out.LockBits($r2, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $os = $od.Stride
  $ob = New-Object byte[] ($os * $ch)

  for ($y = 0; $y -lt $ch; $y++) {
    $sy = $y0 + $y
    $srow = $sy * $stride
    $orow = $y * $os
    for ($x = 0; $x -lt $cw; $x++) {
      $si = $srow + ($x0 + $x) * 4
      $oi = $orow + $x * 4
      $b = [int]$buf[$si]; $g = [int]$buf[$si+1]; $r = [int]$buf[$si+2]
      $lum = ($r + $g + $b) / 3

      if ($lum -ge 250) { $a = 0 }
      elseif ($lum -le 205) { $a = 255 }
      else { $a = [int](255 * (250 - $lum) / 45) }
      if ($a -lt 20) { $a = 0 }

      if ($a -eq 0) {
        $ob[$oi] = 0; $ob[$oi+1] = 0; $ob[$oi+2] = 0; $ob[$oi+3] = 0
        continue
      }
      if ($silhouette) {
        $ob[$oi] = 255; $ob[$oi+1] = 255; $ob[$oi+2] = 255; $ob[$oi+3] = [byte]$a
        continue
      }
      if ($a -lt 255) {
        $f = 255 - $a
        $r = [int](($r * 255 - 255 * $f) / $a)
        $g = [int](($g * 255 - 255 * $f) / $a)
        $b = [int](($b * 255 - 255 * $f) / $a)
        if ($r -lt 0) { $r = 0 }; if ($r -gt 255) { $r = 255 }
        if ($g -lt 0) { $g = 0 }; if ($g -gt 255) { $g = 255 }
        if ($b -lt 0) { $b = 0 }; if ($b -gt 255) { $b = 255 }
      }
      $ob[$oi] = [byte]$b; $ob[$oi+1] = [byte]$g; $ob[$oi+2] = [byte]$r; $ob[$oi+3] = [byte]$a
    }
  }
  [System.Runtime.InteropServices.Marshal]::Copy($ob, 0, $od.Scan0, $ob.Length)
  $out.UnlockBits($od)
  return $out
}

function Save-Png($bitmap, $path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  "wrote $path  ($($bitmap.Width)x$($bitmap.Height))"
}

# Ink bounds measured from the supplied file:
#   whole lockup  x 59..670  y 74..335
#   tower glyph   x 91..234  y 74..335
$logo   = New-Keyed 53 68 624 274 $false     # full lockup, 6px breathing room
$mark   = New-Keyed 85 68 156 274 $false     # tower glyph only
$markW  = New-Keyed 85 68 156 274 $true      # white silhouette, decorative use only

Save-Png $logo  "$outDir\ecs_logo.png"
Save-Png $mark  "$outDir\ecs_mark.png"
Save-Png $markW "$outDir\ecs_mark_white.png"

# ---- square icons: the mark centred on white --------------------------------
function New-Icon([int]$size, [double]$inset) {
  $ico = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gr = [System.Drawing.Graphics]::FromImage($ico)
  $gr.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gr.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gr.Clear([System.Drawing.Color]::White)
  $th = $size * $inset
  $tw = $th * $mark.Width / $mark.Height
  $gr.DrawImage($mark, [float](($size - $tw) / 2), [float](($size - $th) / 2), [float]$tw, [float]$th)
  $gr.Dispose()
  return $ico
}

# Tab-sized icons run nearly full bleed — the tower is fine line work and loses
# too much weight at 32px with normal padding.
foreach ($s in @(32, 48, 180, 192, 512)) {
  $ico = New-Icon $s $(if ($s -le 48) { 0.96 } else { 0.78 })
  $name = if ($s -eq 180) { "$pubDir\apple-touch-icon.png" } else { "$pubDir\favicon-$s.png" }
  Save-Png $ico $name
  $ico.Dispose()
}

# ---- Open Graph card: the lockup on the site's concrete grey -----------------
$og = New-Object System.Drawing.Bitmap 1200, 630, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$gr = [System.Drawing.Graphics]::FromImage($og)
$gr.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gr.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gr.Clear([System.Drawing.Color]::FromArgb(242, 244, 247))
$lw = 780.0
$lh = $lw * $logo.Height / $logo.Width
$gr.DrawImage($logo, [float]((1200 - $lw) / 2), [float]((630 - $lh) / 2 - 14), [float]$lw, [float]$lh)
# marking-yellow rule along the foot, as on the site
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 195, 0))
$gr.FillRectangle($brush, 0, 622, 1200, 8)
$brush.Dispose()
$gr.Dispose()

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ps = New-Object System.Drawing.Imaging.EncoderParameters 1
$ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 88)
$og.Save("$outDir\og.jpg", $enc, $ps)
"wrote $outDir\og.jpg  (1200x630)"
$og.Dispose()

$logo.Dispose(); $mark.Dispose(); $markW.Dispose()

# The untouched original ships alongside the derivatives, so the source of
# truth is always in the deploy.
Copy-Item $src (Join-Path $outDir ("ecs_logo" + [System.IO.Path]::GetExtension($src))) -Force
"copied source to $outDir"
