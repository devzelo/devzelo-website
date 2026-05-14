$files = Get-ChildItem -Path "d:\dz" -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Replace favicon data URL with external SVG
    $content = $content -replace '<link rel="icon" href="data:image/svg\+xml,[^"]+"[^>]*>', '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />'
    # Remove location from meta title
    $content = $content -replace '(<title>[^<]*?)\s*—\s*Lahore,\s*Pakistan\s*(</title>)', '$1$2'
    # Replace mobile menu logo with standard logo SVG
    $content = $content -replace '(?s)(<a href="/"\s+class="mnav-logo">).*?(</a>)', "$1`n        <svg viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" aria-hidden=\"true\">`n          <defs><linearGradient id=\"nlg\" x1=\"0\" y1=\"0\" x2=\"40\" y2=\"40\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#3B82F6\" /><stop offset=\"1\" stop-color=\"#06b6d4\" /></linearGradient></defs>`n          <circle cx=\"20\" cy=\"20\" r=\"6\" stroke=\"url(#nlg)\" stroke-width=\"2.5\" fill=\"none\" />`n          <circle cx=\"20\" cy=\"20\" r=\"2.5\" fill=\"#3B82F6\" />`n          <path d=\"M20 14V6M20 26V34M14 20H6M26 20H34M16 16L10 10M24 24L30 30M16 24L10 30M24 16L30 10\" stroke=\"url(#nlg)\" stroke-width=\"2\" stroke-linecap=\"round\" />`n          <circle cx=\"20\" cy=\"4\" r=\"2\" fill=\"#06b6d4\" />`n          <circle cx=\"36\" cy=\"20\" r=\"2\" fill=\"#3B82F6\" />`n          <circle cx=\"20\" cy=\"36\" r=\"2\" fill=\"#06b6d4\" />`n          <circle cx=\"4\" cy=\"20\" r=\"2\" fill=\"#3B82F6\" />`n          <path d=\"M34 20 A 14 14 0 0 1 20 34\" stroke=\"white\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-dasharray=\"4 4\" opacity=\"0.5\" />`n          <path d=\"M6 20 A 14 14 0 0 1 20 6\" stroke=\"white\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-dasharray=\"4 4\" opacity=\"0.5\" />`n        </svg>`n$2"
    # Make video preload auto for faster load
    $content = $content -replace 'preload="metadata"', 'preload="auto"'
    [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated $($file.Name)"
}
