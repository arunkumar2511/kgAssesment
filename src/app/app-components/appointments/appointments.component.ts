import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {AppService} from '../../services/app.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  morningList = [];
  eveningList = [];
  form = new FormGroup({
    patient_name : new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    from_time: new FormControl('', Validators.required),
    to_time : new FormControl('', Validators.required),
    age : new FormControl('', Validators.required),
    sex : new FormControl('')
  })

  value: Date = new Date (this.getToday());
  from_time = {hour:9,minute:0};
  to_time = {hour:9,minute:30}
  closeResult = ''
  session = '';
  constructor(private modalService: NgbModal , private service : AppService) { }

  ngOnInit(): void {
    this.getAppointmentList()
  }

  getAppointmentList(){
    this.service.getAppointments(new Date()).subscribe((data:any)=>{
      if(data['status']){
        if(data['details']['morning']){
          this.morningList = data['details']['morning'] ;
        }
        if(data['details']['evening']){
          this.eveningList = data['details']['evening'] ;
        }
      }
    })
  }

  getToday(){
    var today = new Date();
    var dd = String(today. getDate()). padStart(2, '0');
    var mm = String(today. getMonth() + 1). padStart(2, '0'); //January is 0!
    var yyyy = today. getFullYear();
    ​return mm + '/' + dd + '/' + yyyy;
  }
  open(content:any,sessionName:any) {
    this.session = sessionName;
    this.modalService.open(content, {size:"lg",ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get f(){
    return this.form.controls;
  }

  setTime(event:any){
    let hours = event['hour'];
    let minutes = event['minute'];
    let thresholdMinute = minutes + 30;
    if(thresholdMinute > 60){
      hours = hours +1;
      thresholdMinute = thresholdMinute - 60
    }
    this.to_time = {hour:hours,minute:thresholdMinute}
  }

  async onSubmit(){
    this.form.value["session"] = this.session;
    this.service.addAppoinments(this.form.value).subscribe((data:any)=>{
      this.modalService.dismissAll();
      this.getAppointmentList();
    })
  }

}
