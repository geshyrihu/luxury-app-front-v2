import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { InfoEmployeeAuthDto } from 'src/app/interfaces/auth/user-token.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import { ProfielServiceService } from 'src/app/services/profiel-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-photo-employee',
  templateUrl: './update-photo-employee.component.html',
  standalone: true,
  imports: [CommonModule, NgbModule, ToastModule],
  providers: [MessageService, CustomToastService],
})
export default class UpdatePhotoEmployeeComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public profielServiceService = inject(ProfielServiceService);

  base_urlImg = environment.base_urlImg + 'Administration/accounts/';
  employeeId?: number = 0;
  infoEmployeeDto: InfoEmployeeAuthDto;
  errorMessage: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.infoEmployeeDto = this.authService.userTokenDto.infoEmployeeDto;
    this.employeeId = this.authService.userTokenDto.infoEmployeeDto.employeeId;
  }

  // Cambio de imagen
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
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.imgName = file;
    };

    this.uploadImg();
  }
  uploadImg() {
    this.customSwalService.onLoading();
    const formData = new FormData();
    formData.append('file', this.imgUpload);
    this.subRef$ = this.dataService
      .put('employees/updateImg/' + this.employeeId, formData)
      .subscribe({
        next: (resp: any) => {
          if (resp.body['pathFile'])
            this.infoEmployeeDto.photoPath = `${this.base_urlImg}${resp.body['pathFile']}`;
          this.profielServiceService.actualizarImagenPerfil(
            this.infoEmployeeDto.photoPath
          );
          this.customSwalService.onClose();
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
