from rest_framework import serializers
from .models import Profile, Tool, Skill
from djoser.serializers import UserCreateSerializer

class ToolSerializer(serializers.ModelSerializer):
  class Meta:
      model = Tool
      fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
  #profile = serializers.ReadOnlyField(source='profile.username')
  tool = serializers.ReadOnlyField(source='tool.name')
  #id = serializers.IntegerField(source='tool.id')
  class Meta:
      model = Skill
      fields = ['id','tool', 'level']

class SkillProfileSerializer(serializers.ModelSerializer):
  tool = serializers.ReadOnlyField(source='tool.name')
  id = serializers.IntegerField(source='tool.id')
  class Meta:
      model = Skill
      fields = ['id','tool', 'level']
     
#Update or set my profile
class ProfileSerializer(serializers.ModelSerializer):
  #avatar = serializers.FileField()
  tools= SkillProfileSerializer(many=True)
  class Meta:
      model = Profile
      fields = ['rol', 'tools']

  def update(self, instance, validated_data):
    instance.rol = validated_data.get('rol', instance.rol)
    instance.save()
    return instance

#Ver mi profile
class ProfileMeSerializer(serializers.ModelSerializer):
  tools= SkillSerializer(source='skill_set', many=True)
  class Meta:
      model = Profile
      fields = ['username','rol','avatar','tools']
      
#Listar profiles      
class ProfileListSerializer(serializers.ModelSerializer):
  #tools= SkillSerializer(source='skill_set', many=True)
  class Meta:
      model = Profile
      fields = ['username','rol','avatar']

class AvatarSerializer(serializers.ModelSerializer):
  avatar = serializers.FileField()
  class Meta:
      model = Profile
      fields = ['avatar']

  def update(self, instance, validated_data):
    instance.avatar = validated_data.get('avatar', instance.avatar)
    instance.save()
    return instance

