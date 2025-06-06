# Generated by Django 5.2 on 2025-04-20 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_position_alter_player_options_alter_report_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='positions',
        ),
        migrations.AddField(
            model_name='player',
            name='position1',
            field=models.CharField(blank=True, choices=[('', '---------'), ('GK', 'Goalkeeper (GK)'), ('CB', 'Centre Back (CB)'), ('LB', 'Left Back (LB)'), ('RB', 'Right Back (RB)'), ('LWB', 'Left Wing Back (LWB)'), ('RWB', 'Right Wing Back (RWB)'), ('CDM', 'Defensive Midfielder (CDM)'), ('CM', 'Central Midfielder (CM)'), ('LM', 'Left Midfielder (LM)'), ('RM', 'Right Midfielder (RM)'), ('CAM', 'Attacking Midfielder (CAM)'), ('LW', 'Left Winger (LW)'), ('RW', 'Right Winger (RW)'), ('CF', 'Centre Forward (CF)'), ('ST', 'Striker (ST)')], max_length=5, verbose_name='Posición Principal'),
        ),
        migrations.AddField(
            model_name='player',
            name='position2',
            field=models.CharField(blank=True, choices=[('', '---------'), ('GK', 'Goalkeeper (GK)'), ('CB', 'Centre Back (CB)'), ('LB', 'Left Back (LB)'), ('RB', 'Right Back (RB)'), ('LWB', 'Left Wing Back (LWB)'), ('RWB', 'Right Wing Back (RWB)'), ('CDM', 'Defensive Midfielder (CDM)'), ('CM', 'Central Midfielder (CM)'), ('LM', 'Left Midfielder (LM)'), ('RM', 'Right Midfielder (RM)'), ('CAM', 'Attacking Midfielder (CAM)'), ('LW', 'Left Winger (LW)'), ('RW', 'Right Winger (RW)'), ('CF', 'Centre Forward (CF)'), ('ST', 'Striker (ST)')], max_length=5, verbose_name='Posición Secundaria'),
        ),
        migrations.AddField(
            model_name='player',
            name='position3',
            field=models.CharField(blank=True, choices=[('', '---------'), ('GK', 'Goalkeeper (GK)'), ('CB', 'Centre Back (CB)'), ('LB', 'Left Back (LB)'), ('RB', 'Right Back (RB)'), ('LWB', 'Left Wing Back (LWB)'), ('RWB', 'Right Wing Back (RWB)'), ('CDM', 'Defensive Midfielder (CDM)'), ('CM', 'Central Midfielder (CM)'), ('LM', 'Left Midfielder (LM)'), ('RM', 'Right Midfielder (RM)'), ('CAM', 'Attacking Midfielder (CAM)'), ('LW', 'Left Winger (LW)'), ('RW', 'Right Winger (RW)'), ('CF', 'Centre Forward (CF)'), ('ST', 'Striker (ST)')], max_length=5, verbose_name='Posición Terciaria'),
        ),
        migrations.DeleteModel(
            name='Position',
        ),
    ]
