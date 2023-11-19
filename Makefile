run-ios:
	cd app && npm run ios -- --simulator="iPhone 12"

server:
	. .venv/bin/activate && cd api && python manage.py runserver