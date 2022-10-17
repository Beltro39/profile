#from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator 
import traceback

class UserAccountManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('Users must have a username')
        try:
            user = self.model(username=username,**extra_fields)
            user.set_password(password)
            user.save()
        except Exception:
            traceback.print_exc()  
        return user

    def create_super_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('Users must have a username')
        
        email = self.normalize_email(email)
        user = self.model(email=email, is_staff=True, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class Tool(models.Model):
    id= models.BigAutoField(primary_key=True)
    name= models.CharField(max_length=100)
    description = models.CharField(max_length=100)

class Profile(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100, )
    rol = models.CharField(max_length=100)
    avatar= models.FileField(default=None, blank=True, null=True)
    tools = models.ManyToManyField(Tool,  through='Skill')
    is_admin = models.BooleanField(default=False)
    USERNAME_FIELD = 'username'

    objects = UserAccountManager()

    @property
    def is_staff(self):
        return self.is_admin

    def filename(self):
        return self.avatar.name  

class Skill(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    level= models.IntegerField(
        default=1,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(1)
        ])

    class Meta:
        unique_together = ('profile', 'tool',)

