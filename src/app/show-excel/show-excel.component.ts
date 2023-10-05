import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tabulator } from 'tabulator-tables';
import * as XLSX from 'xlsx';
import { AddExcelComponent } from './add-excel/add-excel.component';


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
    { title: "id", field: "id", width: '15%' },
    { title: "len", field: "len", width: '25%' },
    { title: "wkt", field: "wkt", width: '25%' },
    { title: "status", field: "status", width: '25%' }
    ,
    {
      title: 'Actions',
      formatter: (cell:any, formatterParams:any, onRendered:any) => {
        // Create custom HTML for edit and delete buttons
        return `
          <button class="edit-button">Edit</button>
          <button class="delete-button">Delete</button>
        `;
      },
      cellClick: (e:any, cell:any) => {
        // Handle button click events
        const button = e.target as HTMLButtonElement;
        if (button.classList.contains('edit-button')) {
          // Handle edit action, e.g., open a modal for editing
          const rowData = cell.getRow().getData();
          console.log('Edit clicked for ID:', rowData.id);
        } else if (button.classList.contains('delete-button')) {
          // Handle delete action, e.g., show a confirmation dialog
          const rowData = cell.getRow().getData();
          console.log('Delete clicked for ID:', rowData.id);
        }
      },
      },
    // ... (other columns)
  ];

  tabulator: any;

  ngOnInit(): void {
    this.drawTable();
  }
  constructor(
    private dialog:MatDialog
  ){

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


    this.tableData=excelData
    console.log(excelData.sort((a:any, b:any) => b.id - a.id));


    this.drawTable()
  };

  reader?.readAsArrayBuffer(file);
}
openDialog(){
  if(this.tableData.length<=0){
    alert('Xahis olunur excel filesini secin')
  }else{
      const dialogRef = this.dialog.open(AddExcelComponent, {
    data: {},width:'25%'
  });

  dialogRef.afterClosed().subscribe(result => {
    debugger

    if(result.id==0){
      let addForm={
      id:this.tableData[0].id+1,
      len:result.len,
      wkt:'',
      status:result.status,
    }
    this.tableData.unshift(addForm)
    this.drawTable()

    }

  });
}
  }

}

