param([string]$args)
$cmd = "C:\Windows\System32\OpenSSH\ssh.exe -i C:\Users\月中茧\.ssh\id_ed25519 -o StrictHostKeyChecking=no $args"
Invoke-Expression $cmd