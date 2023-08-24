import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PasswordValidationDirective } from './validations/password-validation.directive';
import { UsernameUnicoDirective } from './validations/username-unico.directive';

@NgModule({
  declarations: [PasswordValidationDirective, UsernameUnicoDirective],
  imports: [CommonModule],
  exports: [PasswordValidationDirective, UsernameUnicoDirective],
})
export class DirectivesModule {}
