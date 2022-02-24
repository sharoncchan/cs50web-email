from django.contrib import admin

# Register your models here.
from .models import User, Email

admin.site.register(User)

class EmailAdmin(admin.ModelAdmin):
    list_display = ('sender','body')

# Register the admin class with the associated email model
admin.site.register(Email, EmailAdmin)


