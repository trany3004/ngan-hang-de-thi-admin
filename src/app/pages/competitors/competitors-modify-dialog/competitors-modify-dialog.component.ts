import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CompetitorService } from 'src/app/services/competitor.service';
import { OutletService } from 'src/app/services/outlet.service';
import { UploadMediaService } from 'src/app/services/upload-media-service';
@Component({
  selector: 'app-competitors-modify-dialog',
  templateUrl: './competitors-modify-dialog.component.html',
  styleUrls: ['./competitors-modify-dialog.component.scss'],
})
export class CompetitorsModifyDialogComponent implements OnDestroy{
  pgManagementForm: FormGroup;
  subscription: Subscription;
  outlets = [];
  category = '';
  loading;
  selectedFile: File = null;
  filterDateFrom;
  filterDateTo;
  images = {};
  listImages = [];
  constructor(
    public dialogRef: MatDialogRef<CompetitorsModifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private outletService: OutletService,
    private uploadMediaService: UploadMediaService,
    private competitorService: CompetitorService) {
    this.pgManagementForm = this.fb.group({
      program: [null, [Validators.required]],
      pg_outlet: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, []],
      note: [null, []]
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    const dataUpdated = this.data;
      // if (dataUpdated) {
      //   this.subscription = this.outletService.fetchoutlets().subscribe((outlets) => {
      //     this.outlets = outlets;
      //     this.pgManagementForm.controls['pg_outlet'].setValue(dataUpdated.pg_outlet.id);
      //     this.pgManagementForm.controls['endDate'].setValue(dataUpdated.endDate);
      //     this.pgManagementForm.controls['startDate'].setValue(dataUpdated.startDate);
      //     this.pgManagementForm.controls['note'].setValue(dataUpdated.note);
      //     this.pgManagementForm.controls['program'].setValue(dataUpdated.program);
      //     this.listImages = dataUpdated.images;
      //     this.filterDateFrom = dataUpdated.startDate;
      //     this.filterDateTo = dataUpdated.endDate;
      //     this.loading = false;
      //   }, () => this.loading = false)
      // }
  }


  getProduct() {

  }

  update() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      const value = {...this.pgManagementForm.value};
      delete value.reportDate;
      value.images = this.listImages;
      this.competitorService.update(this.data.id, value).subscribe(res => {
        this.loading = false;
        this.dialogRef.close(res);
      }, _ => this.loading = false);
    }
  }

  onFileSelected(event, type, index?) {
    // this.checkUpdateAvatar = true;
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.size <= 1000000) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
          const that = this;
          const position = that.listImages.length;
            reader.onload = function (e: any) {
                if (type === 'update') {
                  that.images[index] = e.target.result;
                } else {
                  that.images[position] = e.target.result;
                }
            };
            reader.readAsDataURL(this.selectedFile);
            this.uploadMediaService.upload(this.selectedFile).subscribe(res => {
              if (res && res.length) {
                if (type === 'update') {
                  this.listImages[index] = res[0];
                } else {
                  this.listImages[position] = res[0];
                }
              }
              },
              errors => {
                  console.error(errors);
              }
            );
        }
    } else {
    }
  }

  deleteImage(index) {
    this.listImages.splice(index, 1);
  }
  
}

