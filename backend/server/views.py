from rest_framework.viewsets import ModelViewSet
from server.models import Server
from server.serializers import ServerSerializer


class ServerViewSet(ModelViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer

    def get_queryset(self):
        request = self.request
        category = request.query_params.get("category", None)
        if category is not None and category is not "":
            return super().get_queryset().filter(category__name=category)
        return super().get_queryset()
