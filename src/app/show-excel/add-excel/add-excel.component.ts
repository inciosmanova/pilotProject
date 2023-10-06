import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-excel',
  templateUrl: './add-excel.component.html',
  styleUrls: ['./add-excel.component.scss']
})
export class AddExcelComponent implements OnInit{
  excelForm!:FormGroup
  constructor(
    public dialogRef: MatDialogRef<AddExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder : FormBuilder
  ) {
  }
  ngOnInit(): void {
    this.createNewForm()
  }
   createNewForm(){
    
  this.excelForm=  this.formbuilder.group({
    id:[this.data?.id || 0],
    len:[this.data?.len ||'',Validators.required],
    wkt:[this.data?.wkt ||''],
    status:[this.data?.status || '1',Validators.required],
  })
   }

   Submit(){
    this.dialogRef.close(this.excelForm.value)
   }
}
