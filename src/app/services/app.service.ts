import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  apiURL = "http://localhost:3000/api";
  constructor(private http:HttpClient) { }

  addAppoinments(formData:any){
    return this.http.post(this.apiURL+'/addAppointment',formData)
  }

  getAppointments(date:any){
    return this.http.post(this.apiURL+'/getAppointment',{date})
  }

  getAppointmentsList(date:any){
    return this.http.post(this.apiURL+'/getAppointmentsList',{date})
  }

  updateStatus(status:String,id:any){
    return this.http.post(this.apiURL+'/updateAppointments',{status,id})
  }
}
