/*import { Injectable } from '@angular/core';
import { Training } from '../model/training.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {

  private apiUrl = 'http://localhost:3000/trainings';

  constructor(private http: HttpClient) {}

  /*private trainings: Training[] = [
    {id:1,name:'Java',description:'Formation Java SE 8 sur 5 jours',price:1500,category:'débutant' },
    {id:2,name:'DotNet',description:'Formation DotNet 3 jours',price:1000,category:'Intermédiaire' },
    {id:3,name:'Python',description:'Formation Python/Django 5 jours',price:2000,category:'avancé' },
    {id:4,name:'Angular',description:'Développement web/Front end 15 jours',price:3500,category:'avancé' },
    {id:5,name:'Html & CSS',description:'Construction page web 10 jours',price:2500,category:'débutant' },
    {id:6,name:'Api Rest',description:'Formation Postman, Insomnia 20 jours',price:3000,category:'Intermédiaire' }
  ];



  getTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  addTraining(training: Training): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }

  updateTraining(training: Training): Observable<Training> {
    return this.http.put<Training>(
      `${this.apiUrl}/${training.id}`, training
    );
  }

  deleteTraining(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}*/

