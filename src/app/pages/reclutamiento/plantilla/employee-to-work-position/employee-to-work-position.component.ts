import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-to-work-position',
  templateUrl: './employee-to-work-position.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class EmployeeToWorkPositionComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;
  workPositionId: number = 0;
  ngOnInit() {
    this.workPositionId = this.config.data.workPositionId;
  }

  searchExistingPerson(fullName: any) {
    this.existingPerson = [];
    this.subRef$ = this.dataService
      .get('Employees/SearchExistingPersonModal/' + fullName.target.value)
      .subscribe({
        next: (resp) => {
          this.existingPerson = resp.body;
        },
        error: (err) => {
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.customSwalService.onClose();
        },
      });
  }
  existingPerson: any;

  onSelectEmployee(personId: number, nameEmployee: string) {
    //todo: implementa swat
    Swal.fire({
      title: '¿Estas seguro?',
      text: `Se va a registrar a ${nameEmployee} a este puesto de trabajo`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, adelante',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.customSwalService.onLoading();
        this.subRef$ = this.dataService
          .get(`WorkPosition/AssignEmployee/${personId}/${this.workPositionId}`)
          .subscribe({
            next: () => {
              this.customToastService.onShowSuccess();
              this.customSwalService.onClose();
            },
            error: (err: any) => {
              this.customToastService.onShowError();
              console.log(err.error);
              this.customSwalService.onClose();
            },
          });
      }
    });
  }
}
