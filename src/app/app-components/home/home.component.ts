import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeTab = 'queue';
  count = "0";
  appointmentsList = []
  constructor(private service:AppService) { }

  ngOnInit(): void {
    this.getAppointmentLists();
  }

  getAppointmentLists(){
    this.service.getAppointmentsList(new Date()).subscribe((data:any)=>{
      if(data['status']){
        this.appointmentsList = data['details'];
        this.count = (this.appointmentsList.length < 10)?"0"+this.appointmentsList.length:""+this.appointmentsList.length
      }
    })
  }

  updateStatus(status:String,index:any){
    this.service.updateStatus(status).subscribe((data:any)=>{
      if(data['status']){
        this.getAppointmentLists()
      }
    })
  }
  
}
