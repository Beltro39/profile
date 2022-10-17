"""pagina_profile URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from main.views import ProfileSetTools_APIView, Tool_APIView, Avatar_APIView,Profile_APIView, ProfileDetail_APIView_Detail


urlpatterns = [
    path('admin/', admin.site.urls),
    path('profile_set', ProfileSetTools_APIView.as_view(), name='profile_set_tools'),
    path('profiles', Profile_APIView.as_view(), name='profile'),
    path('profile/<str:username>/', ProfileDetail_APIView_Detail.as_view(), name='profile'),
    path('tools', Tool_APIView.as_view(), name='tool'),
    path('profile_set_avatar',Avatar_APIView.as_view(), name='profile_set_avatar'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
