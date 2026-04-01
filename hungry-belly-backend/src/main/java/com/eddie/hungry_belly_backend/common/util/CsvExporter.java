package com.eddie.hungry_belly_backend.common.util;

import com.eddie.hungry_belly_backend.user.dto.response.UserCsvDto;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

public class CsvExporter {
    public void export(Writer writer, List<UserCsvDto> listUsers) {
        try {
            ICsvBeanWriter csvWriter = new CsvBeanWriter(writer, CsvPreference.STANDARD_PREFERENCE);
            String[] csvHeaders = {"User ID", "E-mail", "First Name", "Last Name", "Roles", "Status"};
            String[] fieldMapping = {"id", "email", "firstName", "lastName", "roles", "status"};
            csvWriter.writeHeader(csvHeaders);

            for(UserCsvDto user: listUsers) {
                csvWriter.write(user, fieldMapping);
            }

            csvWriter.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}
