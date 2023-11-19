run-ios:
	cd app && npm run ios -- --simulator="Iphone X"

server:
	. .venv/bin/activate && cd api && python manage.py runserver