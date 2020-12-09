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
  showMoreError = false;
  showLesserError = false;
  showBookedError = false;
  showSave = true;
  slot_date = new Date();
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
  to_time = {hour:9,minute:10}
  closeResult = ''
  session = '';
  constructor(private modalService: NgbModal , private service : AppService) { }

  ngOnInit(): void {
    this.getAppointmentList()
  }

  getAppointmentList(){
    this.service.getAppointments(this.slot_date).subscribe((data:any)=>{
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

  changeDate(event:any){
    this.slot_date = new Date(event.target.title)
    this.getAppointmentList()
  }

  getToday(){
    var today = new Date();
    var dd = String(today. getDate()). padStart(2, '0');
    var mm = String(today. getMonth() + 1). padStart(2, '0'); //January is 0!
    var yyyy = today. getFullYear();
    ​return mm + '/' + dd + '/' + yyyy;
  }
  open(content:any,sessionName:any) {
    if(sessionName == 'Morning'){
      this.from_time = {hour:9,minute:0};
      this.to_time = {hour:9,minute:10}
    }else{
      this.from_time = {hour:17,minute:0};
      this.to_time = {hour:17,minute:10}
    }
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
    this.checkSlotExist(hours,minutes);
    let thresholdMinute = minutes + 10;
    if(thresholdMinute > 50){
      hours = hours +1;
      thresholdMinute = thresholdMinute - 60
    }
    this.to_time = {hour:hours,minute:thresholdMinute}
  }
  
  checkSlotExist(hours:Number,minutes:Number){
    this.showBookedError = false ;
    this.showSave = true ;
    let tempList = [];
    if(this.session == 'Morning'){
      tempList = this.morningList;
    }else{
      tempList = this.eveningList;
    }
    let result = tempList.filter((val:any) =>{
      if(val['to_time']['hour'] <= hours &&val['from_time']['hour'] >= hours && val['to_time']['minute'] <= minutes &&val['from_time']['minute'] >= minutes){
        return val
      }
    });
    if(result.length > 0){
      this.showSave = false ;
      this.showBookedError = true ;
    }
  }
  checkDifference(event:any){
    this.showMoreError = false;
    this.showSave = true;
    this.showLesserError = false;
    this.checkSlotExist(event['hour'],event['minute'])
    let hourDiff = event['hour']*60 - this.from_time['hour']*60;
    let minuteDiff = event['minute'] - this.from_time['minute'];
    let totalDiff = hourDiff+minuteDiff;
    if(totalDiff > 30){
      this.showMoreError = true;
      this.showSave = false;
    }
    if(totalDiff < 10){
      this.showLesserError = true;
      this.showSave = false;
    }
  }
  async onSubmit(){
    this.form.value["session"] = this.session;
    this.form.value["slot_date"] = this.slot_date;
    this.service.addAppoinments(this.form.value).subscribe((data:any)=>{
      this.modalService.dismissAll();
      this.getAppointmentList();
    })
  }

}
