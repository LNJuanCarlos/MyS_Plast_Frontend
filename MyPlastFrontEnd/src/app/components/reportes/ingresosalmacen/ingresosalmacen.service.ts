import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/views/pages/auth/login/auth.service';
import { Router } from '@angular/router';
import { IngresosAlmacen } from './ingresosalmacen';

@Injectable({
  providedIn: 'root'
})
export class IngresosalmacenService {

  private urlEndpoint: string = 'http://localhost:8080/reporte';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  private agregarAutorizationHeader(){
    let token = this.authService.token;
    if(token!=null){
      return this.httpHeaders.append('Authorization','Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean{
      if(e.status==401){
        this.router.navigate(['/auth/login']);
        return true;
      }
      if(e.status==403){
        Swal.fire('Acceso Denegado',`Hola ${this.authService.usuario.username}, no tienes permiso para acceder a este recurso!`,'warning');
        this.router.navigate(['/']);
        return true;
      }
      return false;
  }

  filtroIngresosxAlmacen(producto, fecha1, fecha2): Observable<IngresosAlmacen[]> {
    return this.http.get<IngresosAlmacen[]>(`${this.urlEndpoint}/filtroinxalm?producto=${producto}&fecha1=${fecha1}&fecha2=${fecha2}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        Swal.fire({
          icon: 'error',
          title: "<b><h1 style='color:red'>" + 'Error!' + "</h1></b>",
          text: e.error.mensaje,

        })
        return throwError(e);
      })
    );
  }


}
