from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.report_filter import ReportFilter
from app.models.user import User
from app.repositories.report_repository import ReportRepository


class ReportService:

    USER_FIELDS = {
        "id": User.id,
        "name": User.name,
        "email": User.email,
        "role_id": User.role_id,
        "is_active": User.is_active,
        "created_at": User.created_at,
        "updated_at": User.updated_at,
    }

    ALLOWED_OPERATORS = {
        "=",
        "!=",
        ">",
        "<",
        ">=",
        "<=",
        "LIKE",
        "IN",
    }

    @staticmethod
    def create_report(
        db: Session,
        user_id: int,
        name: str,
        description: str | None,
        data_source: str,
        configuration: dict,
    ) -> Report:

        if data_source != "users":
            raise ValueError(
                "Unsupported data source. "
                "Currently only 'users' is supported."
            )

        ReportService.validate_configuration(
            configuration
        )

        report = Report(
            name=name,
            description=description,
            data_source=data_source,
            configuration=configuration,
            created_by=user_id,
        )

        db.add(report)
        db.flush()

        ReportService.save_filters(
            db=db,
            report=report,
            filters=configuration.get(
                "filters",
                [],
            ),
        )

        db.commit()
        db.refresh(report)

        return report

    @staticmethod
    def save_filters(
        db: Session,
        report: Report,
        filters: list,
    ) -> None:

        for filter_config in filters:

            if hasattr(
                filter_config,
                "model_dump",
            ):
                filter_data = (
                    filter_config.model_dump()
                )
            else:
                filter_data = filter_config

            value = filter_data.get("value")

            # Store list values such as IN operators as JSON text
            if isinstance(value, list):
                import json

                value = json.dumps(value)

            elif value is not None:
                value = str(value)

            report_filter = ReportFilter(
                report_id=report.id,
                field=filter_data["field"],
                operator=filter_data["operator"],
                value=value,
            )

            db.add(report_filter)

    @staticmethod
    def replace_filters(
        db: Session,
        report: Report,
        filters: list,
    ) -> None:

        report.filters.clear()

        db.flush()

        ReportService.save_filters(
            db=db,
            report=report,
            filters=filters,
        )

    @staticmethod
    def validate_configuration(
        configuration: dict,
    ) -> None:

        fields = configuration.get(
            "fields",
            [],
        )

        if not fields:
            raise ValueError(
                "At least one field is required."
            )

        for field in fields:

            if field not in ReportService.USER_FIELDS:

                raise ValueError(
                    f"Invalid field: {field}"
                )

        filters = configuration.get(
            "filters",
            [],
        )

        for filter_config in filters:

            field = filter_config.get(
                "field"
            )

            operator = filter_config.get(
                "operator"
            )

            if field not in ReportService.USER_FIELDS:

                raise ValueError(
                    f"Invalid filter field: {field}"
                )

            if operator not in ReportService.ALLOWED_OPERATORS:

                raise ValueError(
                    f"Invalid filter operator: {operator}"
                )

            if operator == "IN":

                value = filter_config.get(
                    "value"
                )

                if not isinstance(
                    value,
                    list,
                ):

                    raise ValueError(
                        "IN operator requires a list."
                    )

        sorts = configuration.get(
            "sort",
            [],
        )

        for sort_config in sorts:

            field = sort_config.get(
                "field"
            )

            direction = sort_config.get(
                "direction",
                "ASC",
            ).upper()

            if field not in ReportService.USER_FIELDS:

                raise ValueError(
                    f"Invalid sort field: {field}"
                )

            if direction not in {
                "ASC",
                "DESC",
            }:

                raise ValueError(
                    f"Invalid sort direction: {direction}"
                )

        group_by = configuration.get(
            "group_by",
            [],
        )

        for field in group_by:

            if field not in ReportService.USER_FIELDS:

                raise ValueError(
                    f"Invalid group field: {field}"
                )

    @staticmethod
    def run_report(
        db: Session,
        report: Report,
    ) -> dict:

        configuration = report.configuration

        ReportService.validate_configuration(
            configuration
        )

        if report.data_source != "users":

            raise ValueError(
                "Unsupported data source."
            )

        fields = configuration["fields"]

        selected_columns = [
            ReportService.USER_FIELDS[field].label(
                field
            )
            for field in fields
        ]

        query = db.query(
            *selected_columns
        )

        # =====================================================
        # FILTERS
        # =====================================================

        for filter_config in configuration.get(
            "filters",
            [],
        ):

            field_name = filter_config["field"]
            operator = filter_config["operator"]
            value = filter_config["value"]

            column = ReportService.USER_FIELDS[
                field_name
            ]

            if operator == "=":

                query = query.filter(
                    column == value
                )

            elif operator == "!=":

                query = query.filter(
                    column != value
                )

            elif operator == ">":

                query = query.filter(
                    column > value
                )

            elif operator == "<":

                query = query.filter(
                    column < value
                )

            elif operator == ">=":

                query = query.filter(
                    column >= value
                )

            elif operator == "<=":

                query = query.filter(
                    column <= value
                )

            elif operator == "LIKE":

                query = query.filter(
                    column.like(value)
                )

            elif operator == "IN":

                if not isinstance(
                    value,
                    list,
                ):

                    raise ValueError(
                        "IN operator requires a list."
                    )

                query = query.filter(
                    column.in_(value)
                )

        # =====================================================
        # GROUPING
        # =====================================================

        group_by = configuration.get(
            "group_by",
            [],
        )

        if group_by:

            group_columns = [
                ReportService.USER_FIELDS[field]
                for field in group_by
            ]

            query = query.group_by(
                *group_columns
            )

        # =====================================================
        # SORTING
        # =====================================================

        for sort_config in configuration.get(
            "sort",
            [],
        ):

            field = sort_config["field"]

            direction = sort_config.get(
                "direction",
                "ASC",
            ).upper()

            column = ReportService.USER_FIELDS[
                field
            ]

            if direction == "DESC":

                query = query.order_by(
                    desc(column)
                )

            else:

                query = query.order_by(
                    asc(column)
                )

        results = query.all()

        rows = [
            dict(row._mapping)
            for row in results
        ]

        return {
            "report_id": report.id,
            "report_name": report.name,
            "data_source": report.data_source,
            "columns": fields,
            "rows": rows,
            "total_records": len(rows),
        }

    @staticmethod
    def get_user_reports(
        db: Session,
        user_id: int,
    ) -> list[Report]:

        return ReportRepository.get_by_user(
            db,
            user_id,
        )

    @staticmethod
    def get_report(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> Report:

        report = ReportRepository.get_by_id(
            db,
            report_id,
        )

        if not report:

            raise ValueError(
                "Report not found."
            )

        if report.created_by != user_id:

            raise ValueError(
                "You do not have access to this report."
            )

        return report

    @staticmethod
    def delete_report(
        db: Session,
        report_id: int,
        user_id: int,
    ) -> None:

        report = ReportService.get_report(
            db,
            report_id,
            user_id,
        )

        ReportRepository.delete(
            db,
            report,
        )