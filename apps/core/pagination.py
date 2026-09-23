"""
apps/core/pagination.py
─────────────────────────────────────────────
Standard pagination used across all list endpoints.
Default: 12 items/page (configurable via ?page_size=N, max 50)
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50
    page_query_param = "page"

    def get_paginated_response(self, data):
        return Response(
            {
                "pagination": {
                    "count": self.page.paginator.count,
                    "total_pages": self.page.paginator.num_pages,
                    "current_page": self.page.number,
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                    "page_size": self.get_page_size(self.request),
                },
                "results": data,
            }
        )

    def get_paginated_response_schema(self, schema):
        return {
            "type": "object",
            "properties": {
                "pagination": {
                    "type": "object",
                    "properties": {
                        "count": {"type": "integer"},
                        "total_pages": {"type": "integer"},
                        "current_page": {"type": "integer"},
                        "next": {"type": "string", "nullable": True},
                        "previous": {"type": "string", "nullable": True},
                        "page_size": {"type": "integer"},
                    },
                },
                "results": schema,
            },
        }
