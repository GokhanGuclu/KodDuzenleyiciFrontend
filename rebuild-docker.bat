@echo off
echo Docker container'ı yeniden build ediliyor...

echo 1. Container durduruluyor...
docker stop kod-duzeltme-frontend 2>nul

echo 2. Container siliniyor...
docker rm kod-duzeltme-frontend 2>nul

echo 3. Image build ediliyor...
docker build -t kod-duzeltme-frontend .

echo 4. Yeni container başlatılıyor...
docker run -d -p 3000:3000 --name kod-duzeltme-frontend kod-duzeltme-frontend

echo ✅ Tamamlandı! Frontend http://localhost:3000 adresinde çalışıyor.
pause
