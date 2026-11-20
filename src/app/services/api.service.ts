
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiTraining } from '../model/api-training.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  public getTrainings(): Observable<ApiTraining[]> {
    return this.http.get<ApiTraining[]>(environment.host + '/trainings');
  }

  public postTraining(training : ApiTraining){
    return this.http.post<ApiTraining>(environment.host + "/trainings" , training);
  }


  public putTraining(id: number, training: ApiTraining): Observable<ApiTraining> {
    return this.http.put<ApiTraining>(environment.host + '/trainings/' + id, training);
  }

  public delTraining(id : number): Observable<void> {
    return this.http.delete<void>(environment.host + "/trainings/" + id);
  }

  public getTraining(id : number){
    return this.http.get<ApiTraining>(environment.host + "/trainings/" + id);
  }
}
