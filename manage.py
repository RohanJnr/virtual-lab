#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from contextlib import suppress

import django
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command


with suppress(ModuleNotFoundError):
    from dotenv import load_dotenv

    load_dotenv()  # take environment variables from .env.c
    print("dotenv file loaded.")

DEFAULT_USERNAME_DEBUG = "admin"
DEFAULT_PASSWORD_DEBUG = "admin"


def create_super_user(username: str, password: str) -> None:
    """Create superuser."""
    User = get_user_model()
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_superuser(username, "", password)
        print(f"Superuser with username {user.username} created.")


def pre_run() -> None:
    """Migrate migrations and create superuser."""
    django.setup()

    call_command("migrate")

    if settings.DEBUG:
        create_super_user(DEFAULT_USERNAME_DEBUG, DEFAULT_PASSWORD_DEBUG)
        return

    create_super_user(
        os.environ.get("SUPERUSER_USERNAME"), os.environ.get("SUPERUSER_PASSWORD")
    )

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rero_pes.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    pre_run()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
