# Generated by Django 4.1.13 on 2024-03-01 05:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("service", "0003_alter_user_date_of_birth_alter_user_first_name_and_more"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="user",
            managers=[],
        ),
        migrations.RemoveField(
            model_name="user",
            name="identification_file",
        ),
    ]
