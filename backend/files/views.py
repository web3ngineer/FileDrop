from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
from django.contrib.auth.decorators import login_required
from .models import File
from django.conf import settings
from django.db import transaction
from .serializers import FileSerializer
import logging
import os

logger = logging.getLogger(__name__)

@api_view(['GET'])
def root(request):
    return Response({"message": "Welcome to Files Route", "success":True, "status":201})


@api_view(['POST'])
def upload_file(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=401)
    
    file = request.FILES.get('file')
    if not file:
        return Response({"message": "No file provided", "success": False}, status=400)
    
    if not file.name.endswith(('.txt','.pdf','.docx','.xlsx','.pptx','.jpg','.png')):
        return Response({"message": "Invalid file type", "success": False}, status=400)
    
    if file.size > 10*1024*1024:  # 10 MB limit
        return Response({"message": "File size limit exceeded", "success": False}, status=400)
    
    # print("File:",file.content_type.split('/')[-1])
    # print("File Name:",file.name.rsplit('.', 1)[0])
    # print("File Size:",file.size)
    
    # # Save the file to the server
    createFile = File.objects.create(
        file_owner = request.user,
        file_name = file.name.rsplit('.', 1)[0],
        file_size = file.size,
        file_type = file.content_type.split('/')[-1],
        file_path = file,
    )
    createFile.save()
    return Response({"message": "File uploaded successfully", "success": True}, status=201)

    
@api_view(['DELETE'])
def delete_file(request, file_id):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=401)
    
    try:
        file = File.objects.get(id=file_id, file_owner=request.user)
        file_path = os.path.join(settings.MEDIA_ROOT, str(file.file_path))

        # Debugging: Log the file path
        logger.info(f"Attempting to delete file: {file_path}")

        with transaction.atomic():
            # Check if file exists before deleting
            if os.path.isfile(file_path):
                os.remove(file_path)
                logger.info(f"File deleted successfully: {file_path}")
            else:
                logger.warning(f"File not found on server: {file_path}")

            # Delete the file record from the database
            file.delete()

    except File.DoesNotExist:
        return Response({"message": "File not found", "success": False}, status=404)

    except OSError as e:
        logger.error(f"OSError: Could not delete file {file_path} - {e}")
        return Response({"message": "Failed to delete file from server", "success": False}, status=500)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return Response({"message": "An error occurred while deleting the file", "success": False}, status=500)

    return Response({"message": "File deleted successfully", "success": True}, status=200)

    
@api_view(['GET'])
def get_file(request, file_id):
    """Retrieve and return a file for download"""
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        file = File.objects.get(id=file_id, file_owner=request.user)
        
        # Ensure MEDIA_ROOT is prefixed correctly
        file_path = os.path.join(settings.MEDIA_ROOT, str(file.file_path))

        if not os.path.exists(file_path):
            logger.warning(f"File not found on server: {file_path}")
            return Response({"message": "File not found on server", "success": False}, status=status.HTTP_404_NOT_FOUND)

        if os.path.isfile(file_path):
            with open(file_path, 'rb') as f: #  Return the file as a response
                response = FileResponse(open(file_path, 'rb'), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{file.file_path}"'
                return response

    except File.DoesNotExist:
        return Response({"message": "File not found", "success": False}, status=status.HTTP_404_NOT_FOUND)

    except IOError as e:  # Handles file read errors
        logger.error(f"Error reading file {file_id}: {str(e)}")
        return Response({"message": "Error reading file", "success": False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return Response({"message": "An error occurred while retrieving the file", "success": False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_all_files_info(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=401)
    
    files = File.objects.filter(file_owner=request.user)
    # print(files) 
    if not files:
        return Response({"message": "No files found", "success": False}, status=404)
    
    serializer = FileSerializer(files, many=True).data
    
    return Response({"files": serializer, "success": True}, status=200)


@api_view(['GET'])
def get_file_info(request, file_id):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=401)
    
    file = File.objects.get(id=file_id, file_owner=request.user)
    # print(file)
    if not file:
        return Response({"message": "No file found", "success": False}, status=404)
    
    serializer = FileSerializer(file).data
    
    return Response({"file": serializer, "success": True}, status=200)




    
    