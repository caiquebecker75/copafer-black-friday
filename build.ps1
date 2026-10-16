# Monta a apresentação a partir de /src (Pages servindo main / raiz)
#  - index.html : proposta Black Friday Copafer (13 telas) -> projetos.75lab.com.br/copafer-black-friday/
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'src'
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-U8($p) { [IO.File]::ReadAllText($p, $utf8) }

$head   = Read-U8 (Join-Path $src '01-head.html')
$chrome = Read-U8 (Join-Path $src '02-chrome.html')
$slides = Read-U8 (Join-Path $src '03-slides.html')
$script = Read-U8 (Join-Path $src '04-script.html')

$doc = "<!doctype html>`n<html lang=""pt-BR"">`n<head>`n<meta charset=""utf-8"">`n<meta name=""viewport"" content=""width=device-width,initial-scale=1,viewport-fit=cover"">`n<meta name=""author"" content=""75 LAB"">`n" +
       $head + "`n</head>`n<body>`n" + $chrome + "`n" + $slides + "`n" + $script + "`n</body>`n</html>`n"

$out = Join-Path $root 'index.html'
[IO.File]::WriteAllText($out, $doc, $utf8)
"{0,-12} {1,9:N0} bytes" -f 'index.html', (Get-Item $out).Length
