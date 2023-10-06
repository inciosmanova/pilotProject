import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { AddExcelComponent } from './add-excel/add-excel.component';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
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
    { title: "id", field: "id", width: '5%' },
    { title: "len", field: "len", width: '35%' },
    { title: "wkt", field: "wkt", width: '40%' },
    { title: "status", field: "status", width: '10%' }
    ,
    {
      title: 'Actions',
      formatter: (cell:any, formatterParams:any, onRendered:any) => {
        // Create custom HTML for edit and delete buttons
        return `
          <button class="edit-button custom_btn"><img class="edit-button" src="../../assets/image/edit.svg" alt=""></button>
          <button class="delete-button custom_btn"><img class="delete-button" src="../../assets/image/delete.svg" alt="">
          </button>
          <button class="map-button custom_btn" ><img  class="map-button" src="../../assets/image/map.svg" alt="">
          </button>
        `;
      },
      cellClick: (e:any, cell:any) => {
        // Handle button click events
        const button = e.target as HTMLButtonElement;
        if (button.classList.contains('edit-button')) {
          // you can do editing process
          const rowData = cell.getRow().getData();
          this.openDialog(rowData)
        } else if (button.classList.contains('delete-button')) {
          // you can do delete process
          const rowData = cell.getRow().getData();
          console.log('Delete clicked for ID:', rowData.id);
          this.tableData=this.tableData.filter(res=>res.id!==rowData.id)
          console.log(this.tableData);
          this.drawTable()
          
        } else if (button.classList.contains('map-button')) {
          // Handle delete action, e.g., show a confirmation dialog
          const rowData = cell.getRow().getData();
          console.log('Mpt clicked for ID:', rowData.id);
        }
      }
      , width: '10%'
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
openDialog(data:any){
  if(this.tableData.length<=0){
    alert('Xahis olunur excel filesini secin')
  }else{
      const dialogRef = this.dialog.open(AddExcelComponent, {
    data: data,width:'25%'
  });

  dialogRef.afterClosed().subscribe(result => {
    let addForm={
      id:result.id,
      len:result.len,
      wkt:result.wkt,
      status:result.status,
    }
    if(result.id==0){
    addForm.id=this.tableData[0].id+1
    this.tableData.unshift(addForm)

    }else{
      this.tableData.map((res,i)=>{
        res.id==addForm.id ? this.tableData[i]=addForm :''
      })
    }
    this.drawTable()
  });
}
  }

}

