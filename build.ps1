# Monta a apresentação a partir de /src (Pages servindo main / raiz)
#  - index.html : Black Friday Copafer (5 telas) -> projetos.75lab.com.br/copafer-black-friday/
#  - lê as imagens de assets/pdv/ (01-lona-de-fachada.jpg ...) e passa a lista para o kit
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'src'
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-U8($p) { [IO.File]::ReadAllText($p, $utf8) }

$head   = Read-U8 (Join-Path $src '01-head.html')
$slides = Read-U8 (Join-Path $src '02-slides.html')
$script = Read-U8 (Join-Path $src '03-script.html')

# imagens das peças: nome sem extensão -> arquivo (jpg, jpeg, png ou webp)
$pdvDir = Join-Path $root 'assets\pdv'
$pairs = @()
if (Test-Path $pdvDir) {
  Get-ChildItem $pdvDir -File | Where-Object { $_.Extension -match '^\.(jpe?g|png|webp)$' } | Sort-Object Name | ForEach-Object {
    $pairs += ('"{0}":"{1}"' -f $_.BaseName, $_.Name)
  }
}
$script = $script.Replace('/*@@PDV@@*/{}', '{' + ($pairs -join ',') + '}')
if ($script.Contains('@@PDV@@')) { throw 'marcador @@PDV@@ sem substituição no build' }

$doc = "<!doctype html>`n<html lang=""pt-BR"">`n<head>`n<meta charset=""utf-8"">`n<meta name=""viewport"" content=""width=device-width,initial-scale=1,viewport-fit=cover"">`n<meta name=""author"" content=""75 LAB"">`n" +
       $head + "`n</head>`n<body data-tone=""red"">`n" + $slides + "`n" + $script + "`n</body>`n</html>`n"

$out = Join-Path $root 'index.html'
[IO.File]::WriteAllText($out, $doc, $utf8)
"{0,-12} {1,9:N0} bytes - {2} imagens em assets/pdv" -f 'index.html', (Get-Item $out).Length, $pairs.Count
