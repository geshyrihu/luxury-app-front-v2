import { NgFor, NgIf } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subir-pdf',
  templateUrl: './subir-pdf.component.html',
  standalone: true,
  imports: [FileUploadModule, SharedModule, NgIf, NgFor],
})
export default class SubirPdfComponent implements OnInit, OnDestroy {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  uploadedFiles: HttpHeaders[] | any = [];
  maxFileSize: number = 20000000;
  url: string = '';
  pathUrl: string = '';
  ngOnInit(): void {
    this.pathUrl = this.config.data.pathUrl;
    this.url = `${environment.base_url}${this.pathUrl}${this.config.data.serviceOrderId}`;
  }
  ngOnDestroy(): void {
    this.ref.close(true);
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
}
