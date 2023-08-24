// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Subscription } from 'rxjs';
// import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto';
// import { DataService } from 'src/app/services/data.service';
// import { SelectItemService } from 'src/app/services/select-item.service';
// import ComponentsModule from 'src/app/shared/components.module';

// @Component({
//   selector: 'app-addoredit-presupuesto-empresa',
//   templateUrl: './addoredit-presupuesto-empresa.component.html',
//   standalone: true,
//   imports: [ReactiveFormsModule, ComponentsModule, CommonModule],
// })
// export default class AddoreditPresupuestoEmpresaComponent
//   implements OnInit, OnDestroy
// {
//   private formBuilder = inject(FormBuilder);
//   private dataService = inject(DataService);
//   public ref = inject(DynamicDialogRef);
//   public config = inject(DynamicDialogConfig);
//   private selectItemService = inject(SelectItemService);

//   submitting: boolean = false;

//   id: number = 0;
//   cuentaId: number = 0;
//   subRef$: Subscription;
//   cb_customer: ISelectItemDto[] = [];
//   form: FormGroup = this.formBuilder.group({
//     id: { value: this.id, disabled: true },
//     customerId: ['', Validators.required],
//     fechaInicio: ['', Validators.required],
//     fechaFin: ['', [Validators.required]],
//   });

//   onLoadSelectItem() {
//     this.selectItemService
//       .onGetSelectItem('customers')
//       .subscribe((items: ISelectItemDto[]) => {
//         this.cb_customer = items;
//       });
//   }

//   ngOnInit(): void {
//     this.onLoadSelectItem();
//     this.id = this.config.data.id;

//     if (this.id !== 0) this.onLoadData();
//   }
//   get f() {
//     return this.form.controls;
//   }

//   onLoadData() {
//     this.subRef$ = this.dataService
//       .get(`PresupuestoEmpresa/${this.id}`)
//       .subscribe({
//         next: (resp: any) => {
//           this.form.patchValue(resp.body);
//         },
//         error: (err) => {
//           console.log(err.error);
//         },
//       });
//   }
//   onSubmit() {
//     if (this.form.invalid) {
//       Object.values(this.form.controls).forEach((x) => {
//         x.markAllAsTouched();
//       });
//       return;
//     }
//     this.id = this.config.data.id;
//     this.submitting = false;
//     if (this.id === 0) {
//       this.subRef$ = this.dataService
//         .post(`PresupuestoEmpresa`, this.form.value)
//         .subscribe({
//           next: () => {
//             this.ref.close(true);
//           },
//           error: (err) => {
//             console.log(err.error);
//           },
//         });
//     } else {
//       this.subRef$ = this.dataService
//         .put(`PresupuestoEmpresa/${this.id}`, this.form.value)
//         .subscribe({
//           next: () => {
//             this.ref.close(true);
//           },
//           error: (err) => {
//             console.log(err.error);
//           },
//         });
//     }
//     this.submitting = true;
//   }
//   ngOnDestroy(): void {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
