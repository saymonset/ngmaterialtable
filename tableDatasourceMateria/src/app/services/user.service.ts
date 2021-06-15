import { Injectable } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
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
    page: number, per_page:number, predicates:string):  Observable<any | User[]> {

      console.log(page + '=offs Saymon, limit='+per_page);
    return this.http.get<User[]>('https://reqres.in/api/users', {
        params: new HttpParams()
            // .set('courseId', courseId.toString())
            // .set('filter', filter)
            // .set('sortOrder', sortOrder)
            .set('page', per_page  + '')
            .set('per_page', page + '')
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

