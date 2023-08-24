import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
const baseUrlImg = environment.base_urlImg;
@Component({
  selector: 'app-add-or-edit-employee-img',
  templateUrl: './add-or-edit-employee-img.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule],
  providers: [MessageService, ToastService],
})
export default class AddOrEditEmployeeOnlyImgComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public toastService = inject(ToastService);
  private swalService = inject(SwalService);

  is_role: boolean = false;
  submitting: boolean = false;

  private id: string = '';
  photoPath: string = '';
  errorMessage: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.id = this.config.data.applicationUserId;
    this.onLoadData(this.id);
  }

  onLoadData(id: string) {
    this.subRef$ = this.dataService
      .get('Employees/GetDataUser/' + id)
      .subscribe({
        next: (resp: any) => {
          this.photoPath = `${baseUrlImg}Administration/accounts/${resp.body.photoPath}`;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  public imgUpload: any;
  public imgTemp: any;
  imgName: any = '';

  changeImg(file: File) {
    this.imgUpload = file;
    if (!file) {
      this.imgName = '';
      return;
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.imgName = file;
    };
  }
  uploadImg() {
    const formData = new FormData();
    formData.append('file', this.imgUpload);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .put('Employees/updateImg/' + this.id, formData)
      .subscribe({
        next: (resp: any) => {
          if (resp.body['pathFile']) {
            this.photoPath = `${baseUrlImg}Administration/accounts/${resp.body['pathFile']}`;
            this.ref.close(true);
          } else {
            return false;
          }
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
