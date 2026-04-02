package com.eddie.hungry_belly_backend.common.util.export;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.function.Function;

public class ExcelExporter<T> implements ExportStrategy<T> {
    private final String[] headers;
    private final Function<T, Object[]> mapper;
    private final XSSFWorkbook workbook;
    private XSSFSheet sheet;

    public ExcelExporter(String[] headers, Function<T, Object[]> mapper) {
        this.headers = headers;
        this.mapper = mapper;
        this.workbook = new XSSFWorkbook();
    }

    private void writeHeaderLine() {
        sheet = workbook.createSheet("Sheet1");
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        headerStyle.setFont(font);

//            header
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }

    private void writeDataLines(List<T> data) {
        int rowIdx = 1;
        for (T item : data) {
            Row row = sheet.createRow(rowIdx++);
            Object[] values = mapper.apply(item);

            for (int i = 0; i < values.length; i++) {
                Cell cell = row.createCell(i);
                cell.setCellValue(values[i] != null ? values[i].toString() : "");
                sheet.autoSizeColumn(i);
            }
        }
    }

    @Override
    public void export(List<T> data, OutputStream os) throws IOException {
        writeHeaderLine();
        writeDataLines(data);
        workbook.write(os);
    }

    @Override
    public String getFileExtension() {
        return ".xlsx";
    }

    @Override
    public String getContentType() {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
}
