import requests


# Function to get JWT token by logging in
def get_jwt_token(username, password):
    login_url = "http://127.0.0.1:8000/auth/jwt/create/"  # Replace with the actual URL

    data = {"email": "goncalo.manuelguedes@gmail.com", "password": "123"}

    response = requests.post(login_url, data=data)

    if response.status_code == 200:
        token = response.json()
        token = token["tokens"]["access"]
        if token:
            return token
        else:
            print("Token not found in the response.")
            return None
    else:
        print("Login failed. Error:", response.status_code)
        print(response.json())
        return None


# Function to upload an image using the obtained JWT token
def upload_image(jwt_token, image_path):
    api_url = "http://127.0.0.1:8000/sandbox/"  # Replace with the actual URL

    # Create a dictionary with the image file to send in the POST request
    files = {"image": open(image_path, "rb")}

    # Set the Authorization header with the JWT token
    headers = {"Authorization": f"JWT {jwt_token}"}

    # Make the POST request
    response = requests.post(api_url, files=files, headers=headers)

    # Check the response
    if response.status_code == 201:
        print(response.text)
    else:
        print("Error:", response.status_code)
        print(response.text)


# Replace with your actual username and password
username = "goncalo.manuelguedes@gmail.com"
password = "123"

# Replace with the actual path to the image file you want to upload
image_path = "app/src/assets/bear.jpeg"

# Get JWT token
jwt_token = get_jwt_token(username, password)

# If the login was successful, proceed to upload the image
if jwt_token:
    upload_image(jwt_token, image_path)
