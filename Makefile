.PHONY: run run-ios run-server redis

run: run-ios run-server redis

run-ios:
	cd app && npm run ios -- --simulator="iPhone 12"

run-server:
	. .venv/bin/activate && cd api && python manage.py runserver 0.0.0.0:8000

redis:
	redis-server