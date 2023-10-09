import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { AddExcelComponent } from './add-excel/add-excel.component';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Chart } from 'chart.js';
import { BarChartData, Table } from '../_interface/tableData';

@Component({
  selector: 'app-show-excel',
  templateUrl: './show-excel.component.html',
  styleUrls: ['./show-excel.component.scss']
})
export class ShowExcelComponent implements OnInit {
  @ViewChild('tabulator', { static: true }) tabulatorElement!: ElementRef;
  coordinates: string = ''
  showMap: boolean = false
  tableData: Table[] = [];
  tabulator: any;
  constructor( private dialog: MatDialog ) {}
  ngOnInit(): void {
    this.drawTable();
  }

  columnNames = [
    { title: "id", field: "id", width: '10%' },
    { title: "len", field: "len", width: '30%' },
    { title: "wkt", field: "wkt", width: '30%' },
    { title: "status", field: "status", width: '10%' }
    ,
    {
      title: 'Actions',
      formatter: (cell: any, formatterParams: any, onRendered: any) => {
        // Create custom HTML for edit , delete and map buttons
        return `
          <button class="edit-button custom_btn"><img class="edit-button" src="../../assets/image/edit.svg" alt=""></button>
          <button class="delete-button custom_btn"><img class="delete-button" src="../../assets/image/delete.svg" alt="">
          </button>
          <button class="map-button custom_btn" ><img  class="map-button" src="../../assets/image/map.svg" alt="">
          </button>
        `;
      },
      cellClick: (e: any, cell: any) => {
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
          this.tableData = this.tableData.filter(res => res.id !== rowData.id)
          console.log(this.tableData);
          this.drawTable()

        } else if (button.classList.contains('map-button')) {
          // you can do mapp process
          const rowData = cell.getRow().getData();
          this.showMap = false
          this.showMap = true
          this.coordinates = rowData.wkt
        }
      }
      , width: '20%'
    }
  ];
  private drawTable(): void {
    this.tabulator = new Tabulator(this.tabulatorElement.nativeElement, {
      height: "311px",
      data: this.tableData,
      reactiveData: true,
      columns: this.columnNames,
      layout: 'fitData',
    });
  }


  onFileSelected(event: any) {
    //download file excel to grid 
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: Uint8Array = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

      // Now you can access the data from the Excel file
      const firstSheetName = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
      const excelData: Table[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });


      this.tableData = excelData
      console.log(excelData.sort((a: any, b: any) => b.id - a.id));


      this.drawTable()

    };
    reader?.readAsArrayBuffer(file);
  }
  openDialog(data: any) {
   //i use this method for opening dialog
    if (this.tableData.length <= 0) {
      alert('Xahis olunur excel filesini secin')
    } else {
      const dialogRef = this.dialog.open(AddExcelComponent, {
        data: data, width: '25%'
      });

      dialogRef.afterClosed().subscribe(result => {
        let addForm = {
          id: result.id,
          len: result.len,
          wkt: result.wkt,
          status: result.status,
        }
        if (result.id == 0) {
          addForm.id = this.tableData[0].id + 1
          this.tableData.unshift(addForm)

        } else {
          this.tableData.map((res, i) => {
            res.id == addForm.id ? this.tableData[i] = addForm : ''
          })
        }
        this.drawTable()
      });
    }
  }


//Charts
  barChart() {

    //crate bar char 
    //calculate operations
    let sumLen0: number = 0;
    let sumLen1: number = 0;
    let sumLen2: number = 0;
    this.tableData.map(res => {
      if (res.status == 0) {
        sumLen0 += res.len
      } else if (res.status == 1) {
        sumLen1 += res.len
      } else {
        sumLen2 += res.len

      }
    })
    const data: BarChartData[] = [
      { status: 0, len: sumLen0 },
      { status: 1, len: sumLen1 },
      { status: 2, len: sumLen2 },
    ];

    new Chart(
      (document as any).getElementById('barChart'),
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.status),
          datasets: [
            {
              label: 'Lenlərin cəmi',
              data: data.map(row => row.len)
            }
          ]
        }
      }
    );
  }
  pieChart() {
    //crate pie char 
    //calculate operations
    let status1: any = []
    let status2: any = []
    let status0: any = []
    this.tableData.map(res => {
      if (res.status == 0) {
        status0.push(res.status)
      } else if (res.status == 1) {
        status1.push(res.status)
      } else {
        status2.push(res.status)
      }

    })
    let calculatePercent = status0.length + status1.length + status2.length
    var chrt = (document as any).getElementById("pieChart").getContext("2d");
    new Chart(chrt, {
      type: 'pie',
      data: {
        labels: [`0 - ${status0.length} -${(status0.length * 100) / calculatePercent}%`, `1 - ${status1.length}-${(status1.length * 100) / calculatePercent}%`, `2 - ${status2.length} - ${(status2.length * 100) / calculatePercent}%`],
        datasets: [{
          label: "Statusların sayı",
          data: [status0.length, status1.length, status2.length],
          backgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'gold', 'lightblue'],
          hoverOffset: 5
        }],
      },
      options: {
        responsive: false,
      },
    });
  }


}

