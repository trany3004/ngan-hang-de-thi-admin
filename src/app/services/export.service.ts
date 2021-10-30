import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    fileExtension = '.xlsx';

    public exportExcel(jsonData: any[], fileName: string, skipHeader = false, sheetNames = ['data']): void {

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData, {skipHeader: skipHeader});
        const wb: XLSX.WorkBook = { Sheets: { [sheetNames[0]]: ws }, SheetNames: sheetNames };
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, fileName);
    }

    private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.fileType });
        FileSaver.saveAs(data, fileName + this.fileExtension);
    }
}