import io
import csv

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
)

from app.services.report_service import ReportService


class ExportService:

    @staticmethod
    def get_report_data(
        db,
        report,
    ):

        return ReportService.run_report(
            db=db,
            report=report,
        )

    @staticmethod
    def export_csv(
        db,
        report,
    ):

        result = ExportService.get_report_data(
            db,
            report,
        )

        output = io.StringIO()

        writer = csv.writer(
            output
        )

        writer.writerow(
            result["columns"]
        )

        for row in result["rows"]:

            writer.writerow(
                [
                    row.get(column)
                    for column in result["columns"]
                ]
            )

        return output.getvalue()

    @staticmethod
    def export_excel(
        db,
        report,
    ):

        import pandas as pd

        result = ExportService.get_report_data(
            db,
            report,
        )

        dataframe = pd.DataFrame(
            result["rows"],
            columns=result["columns"],
        )

        output = io.BytesIO()

        with pd.ExcelWriter(
            output,
            engine="openpyxl",
        ) as writer:

            dataframe.to_excel(
                writer,
                index=False,
                sheet_name="Report",
            )

        output.seek(0)

        return output

    @staticmethod
    def export_pdf(
        db,
        report,
    ):

        result = ExportService.get_report_data(
            db,
            report,
        )

        output = io.BytesIO()

        document = SimpleDocTemplate(
            output,
            pagesize=landscape(A4),
        )

        data = []

        data.append(
            result["columns"]
        )

        for row in result["rows"]:

            data.append(
                [
                    str(
                        row.get(column, "")
                    )
                    for column in result["columns"]
                ]
            )

        table = Table(
            data,
            repeatRows=1,
        )

        table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.grey,
                    ),
                    (
                        "TEXTCOLOR",
                        (0, 0),
                        (-1, 0),
                        colors.white,
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.black,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        "Helvetica-Bold",
                    ),
                    (
                        "FONTSIZE",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                ]
            )
        )

        document.build(
            [table]
        )

        output.seek(0)

        return output