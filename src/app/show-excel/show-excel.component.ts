import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Tabulator } from 'tabulator-tables';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-show-excel',
  templateUrl: './show-excel.component.html',
  styleUrls: ['./show-excel.component.scss']
})
export class ShowExcelComponent implements OnInit {
  @ViewChild('tabulator', { static: true }) tabulatorElement!: ElementRef;

  tableData: any[] = [
  ];

  columnNames: any[] = [
    { title: "id", field: "id", width: '25%' },
    { title: "len", field: "len", width: '25%' },
    { title: "wkt", field: "wkt", width: '25%' },
    { title: "status", field: "status", width: '25%' },
    // ... (other columns)
  ];

  tabulator: any;

  ngOnInit(): void {
    this.drawTable();
  }

  private drawTable(): void {
    this.tabulator = new Tabulator(this.tabulatorElement.nativeElement, {
      height:"311px",
      data: this.tableData,
      reactiveData: true,
      columns: this.columnNames,
      layout: 'fitData',
    });
  }

 
 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();

  reader.onload = (e: any) => {
    const data: Uint8Array = e.target.result;
    const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

    // Now you can access the data from the Excel file
    const firstSheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    
    console.log(excelData); // Display the loaded Excel data

    this.tableData=excelData
    this.drawTable()
  };

  reader?.readAsArrayBuffer(file);
}
 
}
