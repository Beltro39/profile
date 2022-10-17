Instalar aplicación en Ubuntu

Desplegar Backend (debe correr en el puerto 8000):

cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py makemigrations
python3 manage.py runserver

Desplegar Frontend (deber correr en el puerto 3000):

Instalar node v.14 (https://computingforgeeks.com/install-node-js-14-on-ubuntu-debian-linux/)
cd frontend
sudo apt install npm
npm install
npm start

Usuarios para el login:

Username    Password
Mateo M     passwd321+
Sarrias     passwd123+
Herrera     passwd123+

Mi usuario seria el de nombre Beltrán

