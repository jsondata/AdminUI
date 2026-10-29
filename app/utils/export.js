/* 导出表格数据。 */
(function (global) {
    function downloadCSV(name, headers, rows) {
        const cell = (value) => '"' + String(value ?? '').replace(/"/g, '""') + '"';
        const url = URL.createObjectURL(
            new Blob(
                ['\ufeff' + [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n')],
                { type: 'text/csv;charset=utf-8;' },
            ),
        );
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    global.AdminUIUtils = { downloadCSV };
})(window);
