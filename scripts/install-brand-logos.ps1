# Normalises the supplied brand artwork into public/assets/brands/ as PNG.
#
#   .\scripts\install-brand-logos.ps1 [-Source path\to\logos]
#
# Two things happen to each file, so the logos can sit directly on the page
# without a white card behind them:
#
#   1. If the artwork's border is white, that background is flood-filled away
#      from the edges inward. Flood fill rather than "delete every white
#      pixel", so white *inside* a logo survives — the UltraTech wordmark, the
#      highlights on the Tata Tiscon rebar. Artwork on a deliberate colour
#      (Everest orange, Ramco yellow, Renacon green) is left alone.
#   2. The result is trimmed to its content, so no logo carries dead margin
#      and they all fill the space they are given.
#
# Filenames become the slug and must match src/data/brands.js. Case, spaces
# and underscores are normalised; spelling is not.
param(
  [string]$Source = (Join-Path $PSScriptRoot "..\logos")
)

Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public static class LogoTrim
{
    // Alpha below this counts as already-transparent background.
    const int AlphaFloor = 24;

    public static Bitmap Process(Bitmap src, int whiteCut, out string note)
    {
        int w = src.Width, h = src.Height;
        Bitmap img = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(img))
        {
            g.Clear(Color.Transparent);
            g.DrawImage(src, 0, 0, w, h);
        }

        bool[] bg = new bool[w * h];

        // Is the border mostly near-white (or already transparent)?
        int border = 0, whiteBorder = 0;
        for (int x = 0; x < w; x++)
        {
            foreach (int y in new int[] { 0, h - 1 })
            {
                Color c = img.GetPixel(x, y);
                border++;
                if (c.A < AlphaFloor || (c.R >= whiteCut && c.G >= whiteCut && c.B >= whiteCut)) whiteBorder++;
            }
        }
        for (int y = 0; y < h; y++)
        {
            foreach (int x in new int[] { 0, w - 1 })
            {
                Color c = img.GetPixel(x, y);
                border++;
                if (c.A < AlphaFloor || (c.R >= whiteCut && c.G >= whiteCut && c.B >= whiteCut)) whiteBorder++;
            }
        }

        bool keyWhite = whiteBorder * 100 / border >= 80;
        note = keyWhite ? "keyed" : "colour kept";

        if (keyWhite)
        {
            // Flood fill inward from every border pixel.
            Stack<int> stack = new Stack<int>();
            for (int x = 0; x < w; x++) { stack.Push(x); stack.Push((h - 1) * w + x); }
            for (int y = 0; y < h; y++) { stack.Push(y * w); stack.Push(y * w + w - 1); }

            while (stack.Count > 0)
            {
                int idx = stack.Pop();
                if (idx < 0 || idx >= w * h || bg[idx]) continue;
                int x = idx % w, y = idx / w;
                Color c = img.GetPixel(x, y);
                bool isBg = c.A < AlphaFloor || (c.R >= whiteCut && c.G >= whiteCut && c.B >= whiteCut);
                if (!isBg) continue;
                bg[idx] = true;
                if (x > 0) stack.Push(idx - 1);
                if (x < w - 1) stack.Push(idx + 1);
                if (y > 0) stack.Push(idx - w);
                if (y < h - 1) stack.Push(idx + w);
            }

            for (int i = 0; i < w * h; i++)
                if (bg[i]) img.SetPixel(i % w, i / w, Color.FromArgb(0, 0, 0, 0));
        }

        // Trim to content: anything not flagged background and not transparent.
        int minX = w, minY = h, maxX = -1, maxY = -1;
        for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
            {
                if (img.GetPixel(x, y).A < AlphaFloor) continue;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }

        if (maxX < 0) { return img; } // nothing found; hand back untouched

        Rectangle box = new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
        Bitmap trimmed = img.Clone(box, PixelFormat.Format32bppArgb);
        img.Dispose();
        return trimmed;
    }
}
"@

$src = (Resolve-Path $Source).Path
$dst = (Resolve-Path (Join-Path $PSScriptRoot "..\public\assets\brands")).Path

Get-ChildItem $src -File | Where-Object { $_.Name -notlike "_*" } | ForEach-Object {
  $slug = [System.IO.Path]::GetFileNameWithoutExtension($_.Name).ToLower().Replace("_", "-").Replace(" ", "-")
  $target = Join-Path $dst "$slug.png"

  $img = [System.Drawing.Bitmap]::FromFile($_.FullName)
  $note = ""
  $processed = [LogoTrim]::Process($img, 238, [ref]$note)
  $img.Dispose()

  # Cap the long edge — these render at 100px or less.
  $max = 400
  $scale = [math]::Min(1.0, $max / [math]::Max($processed.Width, $processed.Height))
  $w = [int]([math]::Round($processed.Width * $scale))
  $h = [int]([math]::Round($processed.Height * $scale))

  $out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($processed, 0, 0, $w, $h)
  $g.Dispose()

  $out.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
  "{0,-20} {1,-12} {2}x{3}" -f "$slug.png", $note, $w, $h
  $out.Dispose()
  $processed.Dispose()
}
