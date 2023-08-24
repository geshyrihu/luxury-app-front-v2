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
// import ComponentsModule from 'src/app/shared/components.module';

// @Component({
//   selector: 'app-add-or-edit-presupuesto-empresa-detalle',
//   templateUrl: './add-or-edit-presupuesto-empresa-detalle.component.html',
//   standalone: true,
//   imports: [ReactiveFormsModule, ComponentsModule, CommonModule],
// })
// export default class AddOrEditPresupuestoEmpresaDetalleComponent
//   implements OnInit, OnDestroy
// {
//   private formBuilder = inject(FormBuilder);
//   public config = inject(DynamicDialogConfig);
//   public dataService = inject(DataService);
//   public ref = inject(DynamicDialogRef);
//   submitting: boolean = false;

//   id: number = 0;
//   presupuestoEmpresaId: number = this.config.data.presupuestoEmpresaId;
//   subRef$: Subscription;
//   cb_compraSubCuenta: ISelectItemDto[] = [];

//   form: FormGroup = this.formBuilder.group({
//     id: { value: this.id, disabled: true },
//     presupuestoEmpresaId: [this.presupuestoEmpresaId, Validators.required],
//     compraSubCuentaId: ['', Validators.required],
//     presupuestoMensual: ['', Validators.required],
//   });

//   ngOnInit(): void {
//     this.onLoadSubCuentas();
//     this.id = this.config.data.id;

//     if (this.id !== 0) this.onLoadData();
//   }
//   onLoadData() {
//     this.subRef$ = this.dataService
//       .get(`PresupuestoEmpresaDetalle/${this.id}`)
//       .subscribe({
//         next: (resp: any) => {
//           this.form.patchValue(resp.body);
//         },
//         error: (err) => {
//           console.log(err.error);
//         },
//       });
//   }
//   onLoadSubCuentas() {
//     this.subRef$ = this.dataService
//       .get(
//         `CompraSubCuenta/GetSelectItemToPresuppuestoDetalle/${this.presupuestoEmpresaId}`
//       )
//       .subscribe(
//         (resp: any) => {
//           this.cb_compraSubCuenta = resp.body;
//         },
//         (err) => {
//           console.log(err.error);
//         }
//       );
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
//         .post(`PresupuestoEmpresaDetalle`, this.form.value)
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
//         .put(`PresupuestoEmpresaDetalle/${this.id}`, this.form.value)
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

//   onLoadCompraCubCuenta() {}
//   get f() {
//     return this.form.controls;
//   }

//   ngOnDestroy(): void {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
