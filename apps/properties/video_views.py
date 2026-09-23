"""
apps/properties/video_views.py
─────────────────────────────────────────────
Admin (JWT) video endpoints:
  GET    /api/admin/properties/{id}/videos/              → list videos
  POST   /api/admin/properties/{id}/videos/              → upload video
  DELETE /api/admin/properties/{id}/videos/{vid_id}/    → delete video
"""
import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db import DatabaseError

from .models import Property, PropertyVideo
from .serializers import PropertyVideoSerializer, PropertyVideoUploadSerializer

logger = logging.getLogger(__name__)


# ─── Video List + Upload ───────────────────────────────────────────────────────

class PropertyVideoView(APIView):
    """
    GET  /api/admin/properties/{id}/videos/   → List all videos for a property
    POST /api/admin/properties/{id}/videos/   → Upload a new video

    POST accepts multipart/form-data with:
      - video        (required) : .mp4 / .webm / .mov, max 200 MB
      - title        (optional) : short label for this video
      - video_type   (optional) : walkthrough / aerial / testimonial / construction / other
      - thumbnail    (optional) : custom thumbnail image (.jpg/.png/.webp, max 5 MB)
      - duration_sec (optional) : video length in seconds
      - order        (optional) : display order (default 1)
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request, pk):
        try:
            prop    = get_object_or_404(Property, pk=pk)
            videos  = prop.videos.all()
            serializer = PropertyVideoSerializer(
                videos, many=True, context={"request": request}
            )
            return Response(serializer.data)

        except DatabaseError as e:
            logger.error("PropertyVideoView.get - DB error for property pk=%s: %s", pk, e)
            return Response(
                {"error": "Database error while fetching videos."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception:
            logger.exception("PropertyVideoView.get - Unexpected error for property pk=%s", pk)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, pk):
        try:
            prop = get_object_or_404(Property, pk=pk)

            video_file = request.FILES.get("video")
            if not video_file:
                return Response(
                    {"error": "No video file provided. Send the file under the 'video' key."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = PropertyVideoUploadSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    video = serializer.save(property=prop)
                    read_serializer = PropertyVideoSerializer(
                        video, context={"request": request}
                    )
                    return Response(
                        {
                            "message": "Video uploaded successfully.",
                            "video":   read_serializer.data,
                        },
                        status=status.HTTP_201_CREATED,
                    )

                except (OSError, IOError) as file_err:
                    logger.warning(
                        "PropertyVideoView.post - File error for property pk=%s: %s",
                        pk, file_err
                    )
                    return Response(
                        {"error": "Video file could not be saved. Check disk space or permissions."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                except DatabaseError as db_err:
                    logger.error(
                        "PropertyVideoView.post - DB error for property pk=%s: %s",
                        pk, db_err
                    )
                    return Response(
                        {"error": "Database error while saving video."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            logger.exception(
                "PropertyVideoView.post - Unexpected error for property pk=%s", pk
            )
            return Response(
                {"error": "An unexpected error occurred while uploading the video."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ─── Video Delete ──────────────────────────────────────────────────────────────

class PropertyVideoDeleteView(APIView):
    """
    DELETE /api/admin/properties/{id}/videos/{vid_id}/
    Deletes the video record AND the actual file from storage (local or R2).
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, vid_id):
        try:
            video = get_object_or_404(PropertyVideo, pk=vid_id, property__pk=pk)

            # Delete the physical file (works for both local + R2 via django-storages)
            try:
                if video.video:
                    video.video.delete(save=False)
                if video.thumbnail:
                    video.thumbnail.delete(save=False)
            except (OSError, IOError) as file_err:
                # Log but don't block — DB record should still be cleaned up
                logger.warning(
                    "PropertyVideoDeleteView - Could not delete files for video pk=%s: %s",
                    vid_id, file_err
                )

            video.delete()
            return Response(
                {"message": "Video deleted successfully."},
                status=status.HTTP_200_OK,
            )

        except DatabaseError as e:
            logger.error(
                "PropertyVideoDeleteView - DB error for video pk=%s: %s", vid_id, e
            )
            return Response(
                {"error": "Database error while deleting the video."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception:
            logger.exception(
                "PropertyVideoDeleteView - Unexpected error for video pk=%s", vid_id
            )
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
