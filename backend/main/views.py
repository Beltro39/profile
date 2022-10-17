from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ProfileMeSerializer, ProfileSerializer,ToolSerializer, AvatarSerializer, ProfileListSerializer, SkillProfileSerializer
from .models import Profile, Skill, Tool
from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated  

class Profile_APIView(APIView):
     def get(self, request, format=None, *args, **kwargs):
        profiles = Profile.objects.exclude(username= request.user)
        serializer = ProfileListSerializer(profiles, many=True)
        return Response(serializer.data)
    
class ProfileDetail_APIView_Detail(APIView):
    def get(self, request, username, format=None):
        print("hhh")
        profile = Profile.objects.get(username= username)
        serializer = ProfileMeSerializer(profile)  
        return Response(serializer.data)


class ProfileSetTools_APIView(APIView):

    def put(self, request, format=None):
        profile= Profile.objects.get(username= request.user)
        serializer =  ProfileSerializer(profile, data=request.data)
        print("request", request.data)
        if serializer.is_valid():
            tools= serializer.validated_data['tools'] 
            p1= serializer.save()
            print(tools)
            for tool in tools:
                level= 0
                id= 0
                for key, value in tool.items():
                    if key== 'tool':
                        id= value['id']
                    if key == 'level':
                        level= value
                print(id, level)
                toolObj= Tool.objects.get(id=id)
                print(toolObj)
                skill= Skill(profile= p1, tool= toolObj, level= level)
                skill.save()
                
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class Avatar_APIView(APIView):
    def put(self, request, format=None):
        profile= Profile.objects.get(username= request.user)
        serializer = AvatarSerializer(profile,data=request.data)
        if serializer.is_valid():
            #user = User(name=serializer.data['name'], )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class Tool_APIView(APIView):
    def get(self, request, format=None, *args, **kwargs):
        profiles = Tool.objects.all()
        serializer = ToolSerializer(profiles, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ToolSerializer(data=request.data)
        if serializer.is_valid():
            #user = User(name=serializer.data['name'], )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

