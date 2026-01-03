import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from '../../pipes/safe.pipe';

@NgModule({
  declarations: [
    SafePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafePipe
  ]
})
export class SharedModule { }
