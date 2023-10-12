import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
@NgModule({
  imports: [EditorModule, TableModule, ToastModule],
  exports: [EditorModule, TableModule, ToastModule],
})
export default class PrimeNgModule {}
