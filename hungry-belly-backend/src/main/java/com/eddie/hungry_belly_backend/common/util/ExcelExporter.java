package com.eddie.hungry_belly_backend.common.util;

import com.eddie.hungry_belly_backend.user.dto.response.UserCsvDto;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.function.Function;

public class ExcelExporter {

    public void export(List<UserCsvDto> data, OutputStream os) {
        try (Workbook workbook = new XSSFWorkbook()){
            Sheet sheet = workbook.createSheet("Users");

            String[] headers = {"User ID", "E-mail", "First Name", "Last Name", "Roles", "Status"};

            Function<UserCsvDto, Object[]> mapper = u ->
                    new Object[]{u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRoles(), u.getStatus()};

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

            int rowIdx = 1;
            for (UserCsvDto item : data) {
                Row row = sheet.createRow(rowIdx++);
                Object[] values = mapper.apply(item);

                for (int i = 0; i < values.length; i++) {
                    Cell cell = row.createCell(i);
                    cell.setCellValue(values[i] != null ? values[i].toString() : "");
                }
            }

//            auto-size after all data is written
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(os);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
