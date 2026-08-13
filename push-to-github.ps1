Set-Location -Path "C:\Users\DELL\.gemini\antigravity\scratch\fuelfit-main"
& "C:\Program Files\Git\cmd\git.exe" config --global user.email "harshgarg2006@gmail.com"
& "C:\Program Files\Git\cmd\git.exe" config --global user.name "HarshGarg2006"
& "C:\Program Files\Git\cmd\git.exe" init
& "C:\Program Files\Git\cmd\git.exe" branch -M main
& "C:\Program Files\Git\cmd\git.exe" remote remove origin 2>$null
& "C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/HarshGarg2006/fuelfit.git
& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "feat: add Nutrition Calculator, fix dropdown option contrast, and integrate AI Support Assistant"
& "C:\Program Files\Git\cmd\git.exe" push -u origin main --force
