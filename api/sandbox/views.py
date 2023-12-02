import io
import json
from typing import Any

import torch
from PIL import Image
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from torchvision import models, transforms
from django.utils import timezone

from .models import SandChanges
from .serializers import (
    SandboxGetSerializer,
    SandboxPostSerializer,
    SandImagesSerializer,
)
from .paginification import CustomPagination


class SandboxPostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = models.resnext101_64x4d(
            weights=models.ResNeXt101_64X4D_Weights.DEFAULT
        ).to(self.device)
        self.model.eval()
        self.transform = transforms.Compose(
            [
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.299, 0.224, 0.225]),
            ]
        )

        class_idx = json.load(
            open(
                "/Users/goncaloguedes/Documents/PythonProjects/Cat-Litter/api/sandbox/imagenet_class_index.json"
            )
        )
        self.class_idx = [class_idx[str(k)][1] for k in range(len(class_idx))]

    def __classify(self, image):
        # Convert InMemoryUploadedFile to PIL Image
        pil_image = Image.open(io.BytesIO(image.read()))
        pil_image = pil_image.convert("RGB")

        image = self.transform(pil_image).unsqueeze(0)
        image = image.to(self.device)
        with torch.no_grad():
            output = self.model(image)
        probability = torch.nn.functional.softmax(output[0], dim=0).cpu().numpy()
        prediction = self.class_idx[probability.argmax()]
        return prediction

    def post(self, request, *args, **kwargs):
        serializer = SandboxPostSerializer(data=request.data)

        if serializer.is_valid():
            print(request.user)
            # SandChanges.objects.create(user=request.user)
            prediction = self.__classify(serializer.validated_data["image"])

            # Save image to database
            image = serializer.validated_data["image"]

            SandChanges.objects.create(
                user=request.user, date=timezone.now(), image=image
            )

            return Response(
                {"message": f"{prediction}"},
                status=status.HTTP_201_CREATED,
            )

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        queryset = SandChanges.objects.select_related("user").order_by("-date")
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = SandboxGetSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


# Get SandboxImage
class SandboxGetView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        try:
            # Retrieve the object from the database
            queryset = SandChanges.objects.get(id=id)
            url = queryset.image.url

            # Serialize the queryset
            serializer = SandImagesSerializer({"image": url})

            # Return the serialized data as JSON response
            return Response(serializer.data, status=status.HTTP_200_OK)

        except SandChanges.DoesNotExist:
            return Response(
                {"error": "Object not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
