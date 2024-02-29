# Generated by Django 4.1.13 on 2024-02-29 11:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(default='1989-03-14'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='identification_file',
            field=models.FileField(default=0, upload_to='identification_files/'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='identification_number',
            field=models.CharField(default=123, max_length=30),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(max_length=30),
        ),
    ]