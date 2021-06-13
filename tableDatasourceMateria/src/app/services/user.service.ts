import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { User, UserData } from '../interfaces/users.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }



  getUsers(termino: string | undefined): Observable<UserData> {
    return this.http.get<UserData>('https://reqres.in/api/users?page=2');
  }



  getOnlyUsers(
    offset: number, limit:number, predicates:string):  Observable<any | User[]> {

      console.log(offset + '=offs Saymon, limit='+limit);
    return this.http.get<User[]>('https://reqres.in/api/users', {
        params: new HttpParams()
            // .set('courseId', courseId.toString())
            // .set('filter', filter)
            // .set('sortOrder', sortOrder)
            .set('page', offset + '')
            .set('per_page', limit + '')
    }).pipe(
         map( (resp: any | User[]) => 
         {
         
          return resp.data ;
         }
         )
    );
    
    // .pipe(
    //     map(res =>  res["payload"])
    // );
}
}
