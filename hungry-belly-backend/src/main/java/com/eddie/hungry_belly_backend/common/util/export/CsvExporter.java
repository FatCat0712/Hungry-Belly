package com.eddie.hungry_belly_backend.common.util.export;

import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;

public class CsvExporter<T> implements ExportStrategy<T>{
    private final String[] headers;
    private final String[] fieldMapping;

    public CsvExporter(String[] headers, String[] fieldMapping) {
        this.headers = headers;
        this.fieldMapping = fieldMapping;
    }

    @Override
    public void export(List<T> data, OutputStream os) throws Exception {
        try {
            Writer writer = new OutputStreamWriter(os);
            ICsvBeanWriter csvWriter = new CsvBeanWriter(writer, CsvPreference.STANDARD_PREFERENCE);
            csvWriter.writeHeader(headers);

            for(T item : data) {
                csvWriter.write(item, fieldMapping);
            }
            csvWriter.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getFileExtension() {
        return ".csv";
    }

    @Override
    public String getContentType() {
        return "text/csv";
    }
}
