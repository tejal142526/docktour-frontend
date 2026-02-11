import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { subscribe } from 'diagnostics_channel';
import { Wpapi } from '../../Services/Services/wpapi';
declare const AOS: any;

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule, ɵInternalFormsSharedModule, FormsModule,ReactiveFormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private fb: FormBuilder, private wpapi: Wpapi) {}

 emailControl = new FormControl('',[Validators.required,Validators.email])

  onSubscribe() {
    if(this.emailControl.invalid){
      this.emailControl.markAsTouched();
      return
    }
     this.wpapi.subscribeNewsLetter({email:this.emailControl.value}).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.emailControl.reset()
          this.emailControl.markAsUntouched()
          this.emailControl.markAsPristine()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Newsletter subscribed successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error submitting form',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error?.error?.message,
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }
  ngAfterViewInit(){
  this.aosview()
  }

  aosview() {
    AOS.init({ duration: 1200, once: true });
    setTimeout(() => AOS.refresh(), 400);
  }
   
}
