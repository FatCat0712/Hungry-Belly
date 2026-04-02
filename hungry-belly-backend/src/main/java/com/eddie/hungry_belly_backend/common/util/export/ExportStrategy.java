package com.eddie.hungry_belly_backend.common.util.export;

import java.io.OutputStream;
import java.util.List;

public interface ExportStrategy<T> {
    void export(List<T> data, OutputStream os) throws Exception;
    String getFileExtension();
    String getContentType();
}
