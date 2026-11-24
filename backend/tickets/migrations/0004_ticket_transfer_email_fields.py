from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0003_ticket_details_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticketorder',
            name='recipient_email',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='ticketorder',
            name='recipient_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='ticketorder',
            name='transfer_from_name',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
