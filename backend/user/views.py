
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import CustomUser
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import UserDataSerializer
from django.middleware.csrf import get_token


@api_view(['POST'])
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"message": "Username and Password are required", "success": False},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not CustomUser.objects.filter(username=username).exists():
        return Response(
            {"message": "User not found", "success": False},
            status=status.HTTP_404_NOT_FOUND
        )

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"message": "Invalid Password", "success": False},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)  # Sets sessionid cookie
    csrf_token = get_token(request)
    user_data = UserDataSerializer(user).data

    response = Response(
        {
            "message": "User Logged in Successfully",
            "user": user_data,
            "success": True
        },
        status=status.HTTP_200_OK
    )

    # Set csrftoken (accessible by JS)
    # response.set_cookie(
    #     key='csrftoken',
    #     value=csrf_token,
    #     httponly=False,
    #     samesite= 'None',
    #     secure=False  # Set to True in production with HTTPS
    # )

    # # Set sessionid (optional, usually already set by login)
    # response.set_cookie(
    #     key='sessionid',
    #     value=request.session.session_key,
    #     httponly=True,
    #     samesite='None',
    #     secure=True  # Set to True in production
    # )

    return response


@api_view(['POST'])
def signup(request):
    
    data = request.data  # Get JSON data
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    if password != confirm_password:
        return Response({"message": "Passwords do not match", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    if CustomUser.objects.filter(email=email).exists():
        return Response({"message": "Email already exists", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    if CustomUser.objects.filter(username=username).exists():
        return Response({"message": "Username already exists", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    user = CustomUser.objects.create_user(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        phone_number=phone_number,
    )
    user.set_password(password)  # Encrypt password
    user.save()
    
    return Response({"message": "User created successfully", "success": True}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def signout(request):
    if not request.user.is_authenticated:
        return Response({"message": "No user logged in", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    logout(request)
    return Response({"message": "User logged out successfully", "success": True}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_csrf_token(request):
    csrf_token = get_token(request)
    return Response({"csrfToken": csrf_token}, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_user_info(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    user_info = {
        "id": user.id,
        "full_name": user.get_full_name(),
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "created_at": user.date_joined.strftime("%Y-%m-%d %I:%M %p"),
        "updated_at": user.updated_at.strftime("%Y-%m-%d %I:%M %p"),
        "last_login": user.last_login.strftime("%Y-%m-%d %I:%M %p") if user.last_login else None,
    }
    return Response({"message": "User info fetched successfully","user":user_info, "success": True}, status=status.HTTP_200_OK)


@api_view(['POST'])
def change_password(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if new_password != confirm_password:
        return Response({"message": "New passwords do not match", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    if not user.check_password(current_password):
        return Response({"message": "Current password is incorrect", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)  # Important: Update the session hash to keep the user logged in after password change
  
    return Response({"message": "Password changed successfully", "success": True}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
def update_profile(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    phone_number = request.data.get('phone_number')
    
    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if email:
        user.email = email
    if phone_number:
        user.phone_number = phone_number
    
    user.save()
    
    return Response({"message": "Profile updated successfully", "success": True}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_account(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    user.delete()
    return Response({"message": "Account deleted successfully", "success": True}, status=status.HTTP_200_OK)    


@api_view(['POST'])
def change_username(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    new_username = request.data.get('new_username')
    
    if CustomUser.objects.filter(username=new_username).exists():
        return Response({"message": "Username already exists", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    user.username = new_username
    user.save()
    
    return Response({"message": "Username changed successfully", "success": True}, status=status.HTTP_200_OK)





# Address Management
from .models import Address
from .serializers import AddressSerializer

@api_view(['POST'])
def add_address(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Extract request data
    street_address = request.data.get('street_address')
    city = request.data.get('city')
    state = request.data.get('state')
    postal_code = request.data.get('postal_code')
    country = request.data.get('country')
    is_primary = request.data.get('is_primary', False)
    
    # Validate required fields
    if not all([street_address, city, state, postal_code, country]):
        return Response({"message": "All fields are required", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    existing_addresses = Address.objects.filter(user=user, is_primary=True).first()
    
    if not existing_addresses.exists():
        # If no address exists, set the first one as primary
        is_primary = True
    elif is_primary:
        # If an address exists and the new one is marked as primary, update all to non-primary
        existing_addresses.update(is_primary=False)
        
        
    # serializer = AddressSerializer(data=request.data)
    # 
    # if serializer.is_valid():
        # serializer.save(user=request.user)  # Save with user instance
        # return Response({"message": "Address created successfully", "new_address": serializer.data, "success": True}, status=status.HTTP_201_CREATED)
    # 
    # return Response({"message": "Invalid data", "errors": serializer.errors, "success": False}, status=status.HTTP_400_BAD_REQUEST)

    # Create new address
    new_address = Address.objects.create(
        user=user,
        street_address=street_address,
        city=city,
        state=state,
        postal_code=postal_code,
        country=country,
        is_primary=is_primary  # Ensuring correct primary address logic
    )
    
    address=AddressSerializer(new_address).data

    return Response({"message": "Address created successfully","new_address":address, "success": True}, status=status.HTTP_201_CREATED)

    
@api_view(['GET'])
def get_addresses(request):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    addresses = Address.objects.filter(user=user)
    
    address_list = []
    for address in addresses:
        address_list.append({
            "id": address.id,
            "street_address": address.street_address,
            "city": address.city,
            "state": address.state,
            "postal_code": address.postal_code,
            "country": address.country,
            "is_primary": address.is_primary,
            "user":{
                "id": address.user.id,
                "username": address.user.username,
            }
        })
    
    return Response({"message":"All addresses are fetched Succefully", "addresses": address_list, "success": True}, status=status.HTTP_200_OK)


# @api_view(['PATCH'])
# def update_address(request, address_id):
#     if not request.user.is_authenticated:
#         return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
#     user = request.user
#     try:
#         address = Address.objects.get(id=address_id, user=user)
#     except Address.DoesNotExist:
#         return Response({"message": "Address not found", "success": False}, status=status.HTTP_404_NOT_FOUND)
    
#     # Extract request data
#     street_address = request.data.get('street_address')
#     city = request.data.get('city')
#     state = request.data.get('state')
#     postal_code = request.data.get('postal_code')
#     country = request.data.get('country')
    
#     if not (street_address or city or state or postal_code or country):
#         return Response({"message": "Fields are required", "success": False}, status=status.HTTP_400_BAD_REQUEST)

    
#     # Update fields if provided
#     if street_address:
#         address.street_address = street_address
#     if city:
#         address.city = city
#     if state:
#         address.state = state
#     if postal_code:
#         address.postal_code = postal_code
#     if country:
#         address.country = country
    
#     address.save()
        
#     return Response({"message": "Address updated successfully", "success": True}, status=status.HTTP_200_OK)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_address(request, address_id):
    try:
        address = Address.objects.get(id=address_id, user=request.user)
    except Address.DoesNotExist:
        return Response({"message": "Address not found", "success": False}, status=status.HTTP_404_NOT_FOUND)

    is_partial = request.method == 'PATCH'  # `PATCH` allows partial updates
    serializer = AddressSerializer(address, data=request.data, partial=is_partial)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Address updated successfully", "updated_address": serializer.data, "success": True}, status=status.HTTP_200_OK)

    return Response({"message": "Invalid data", "errors": serializer.errors, "success": False}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_address(request, address_id):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    address = Address.objects.filter(id=address_id, user=user).first()

    if not address:
        # Address not found for the user
        return Response({"message": "Address not found", "success": False}, status=status.HTTP_404_NOT_FOUND)

    if address.is_primary:
        # Check if another address exists to set as primary
        next_address = Address.objects.filter(user=user).exclude(id=address_id).first()
        if not next_address:
            return Response({"message": "Cannot delete the only primary address.", "success": False}, status=status.HTTP_400_BAD_REQUEST)

        # Set the next address as primary
        next_address.is_primary = True
        next_address.save()

    address.delete()
    return Response({"message": "Address deleted successfully", "success": True}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
def set_primary(request, address_id):
    if not request.user.is_authenticated:
        return Response({"message": "User not authenticated", "success": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    try:
        address = Address.objects.get(id=address_id, user=user)
    except Address.DoesNotExist:
        return Response({"message": "Address not found", "success": False}, status=status.HTTP_404_NOT_FOUND)
    
    if address.is_primary:
        return Response({"message": "This address is already set as primary", "success": False}, status=status.HTTP_400_BAD_REQUEST)
    
    # Unset primary for all addresses of the user
    Address.objects.filter(user=user, is_primary=True).update(is_primary=False)
    
    # Set the selected address as primary
    address.is_primary = True
    address.save()
    
    return Response({"message": "Primary address updated successfully", "success": True}, status=status.HTTP_200_OK)


