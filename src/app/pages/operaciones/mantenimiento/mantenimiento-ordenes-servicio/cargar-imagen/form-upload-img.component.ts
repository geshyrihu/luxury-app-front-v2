import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-upload-img',
  templateUrl: './form-upload-img.component.html',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
})
export default class FormUploadImgComponent implements OnInit, OnDestroy {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  uploadedFiles: HttpHeaders[] | any = [];
  maxFileSize: number = 30000000;
  // url = environment.base_url + 'ServiceOrders/SubirImg/';
  url: string = `${environment.base_url}ServiceOrders/SubirImg/${this.config.data.serviceOrderId}`;

  ngOnDestroy(): void {
    this.ref.close(true);
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
  ngOnInit(): void {}
}
