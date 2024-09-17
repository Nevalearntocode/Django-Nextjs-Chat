from uuid import uuid4
from rest_framework import status
from rest_framework.response import Response


class AdditionalMixins:
    def perform_kick_or_ban_or_unban(self, request, action, message):
        instance = self.get_object()
        members = request.data.get("members", [])

        if request.user != instance.owner:
            return Response(
                {"detail": "You don't have permission to perform this action."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if str(instance.owner.id) in members:
            return Response(
                {"detail": "You cannot perform this action on yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not members:
            return Response(
                {"detail": f"No valid members to {action}."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if action == "unban":
            instance.banned.remove(*members)

        if action == "kick":
            instance.members.remove(*members)

        if action == "ban":
            instance.members.remove(*members)
            instance.banned.add(*members)

        instance.save()

        return Response(
            {"detail": f"Successfully {message} the members."},
            status=status.HTTP_200_OK,
        )

    def perform_join_or_leave(self, request, action, message):
        instance = self.get_object()
        user = request.user

        if action == "join":
            if user in instance.banned.all():
                return Response(
                    {"detail": "You are banned from this server."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if instance.status == "private":
                invite_code = request.query_params.get("invite_code", None)
                if invite_code != str(instance.invite_code) or invite_code is None:
                    return Response(
                        {"detail": "Invalid invite code."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            instance.members.add(*[user])

        if action == "leave":
            if user == instance.owner:
                return Response(
                    {"detail": "You cannot leave your server, maybe try deleting it."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            instance.members.remove(*[user])

        instance.save()

        return Response(
            {"detail": f"Successfully {message} the server."},
            status=status.HTTP_200_OK,
        )

    def perform_roll_invite_code_or_toggle_status(self, request, action, message):
        instance = self.get_object()
        user = request.user

        if user != instance.owner:
            return Response(
                {"detail": "You don't have permission to perform this action."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == "toggle_status":
            instance.status = "public" if instance.status == "private" else "private"
            instance.save()

        if action == "roll_invite_code":
            instance.invite_code = uuid4()
            instance.save()

        return Response(
            {"detail": f"{message}"},
            status=status.HTTP_200_OK,
        )
