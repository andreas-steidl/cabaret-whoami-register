param([string]$Html, [string]$Png, [int]$Breite = 1000, [int]$Hoehe = 700, [string]$Anker = "", [switch]$Hell, [double]$Faktor = 1)
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "file:///" + $Html.Replace([string][char]92, "/") + $Anker
$prof = Join-Path $env:TEMP ("edgefoto_" + [guid]::NewGuid().ToString("N"))
Start-Process -FilePath $edge -ArgumentList @("--headless=new","--disable-gpu","--hide-scrollbars","--default-background-color=00000000","--user-data-dir=$prof","--virtual-time-budget=4000",$(if ($Hell) {"--blink-settings=preferredColorScheme=1"} else {"--force-dark-mode"}),"--window-size=$Breite,$Hoehe","--force-device-scale-factor=$Faktor","--screenshot=$Png",$url) -Wait
if (Test-Path -LiteralPath $Png) { "ok " + (Get-Item -LiteralPath $Png).Length } else { "kein Bild" }
