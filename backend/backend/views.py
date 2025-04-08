from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def root(request):
    return Response({"message": "Welcome to Backend Api", "success":True}, status=status.HTTP_200_OK)


@api_view(['GET'])
def health(request):
    return Response({"message": "Everything is up and running.", "success":True}, status=status.HTTP_200_OK)
    
    
    