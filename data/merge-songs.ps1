$merged = [ordered]@{}
for ($i = 1; $i -le 7; $i++) {
    $path = "C:\Users\WIPED\ihearttheatre\data\_batch$i.json"
    $b = Get-Content $path -Raw | ConvertFrom-Json
    foreach ($prop in $b.songs.PSObject.Properties) {
        $merged[$prop.Name] = $prop.Value
    }
    Write-Host "Batch $i`: $($merged.Count) total keys"
}
$final = [ordered]@{
    version = 1
    last_updated = "2026-04-14"
    description = "Audition song suggestions for every role across 22 musicals. Keyed by musical_id/role_id."
    songs = $merged
}
$json = $final | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("C:\Users\WIPED\ihearttheatre\data\audition-songs.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Wrote audition-songs.json with $($merged.Count) roles"
